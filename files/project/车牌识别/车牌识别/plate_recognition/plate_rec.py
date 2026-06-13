from plate_recognition.plateNet import myNet_ocr,myNet_ocr_color
import torch
import torch.nn as nn
import cv2
import numpy as np
import os
import time
import sys
from typing import List, Tuple, Dict
import heapq

def cv_imread(path):  #可以读取中文路径的图片
    img=cv2.imdecode(np.fromfile(path,dtype=np.uint8),-1)
    return img

def allFilePath(rootPath,allFIleList):
    fileList = os.listdir(rootPath)
    for temp in fileList:
        if os.path.isfile(os.path.join(rootPath,temp)):
            if temp.endswith('.jpg') or temp.endswith('.png') or temp.endswith('.JPG'):
                allFIleList.append(os.path.join(rootPath,temp))
        else:
            allFilePath(os.path.join(rootPath,temp),allFIleList)
device = torch.device('cuda') if torch.cuda.is_available() else torch.device("cpu")
color=['黑色','蓝色','绿色','白色','黄色']    
plateName=r"#京沪津渝冀晋蒙辽吉黑苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云藏陕甘青宁新学警港澳挂使领民航危0123456789ABCDEFGHJKLMNPQRSTUVWXYZ险品"
mean_value,std_value=(0.588,0.193)
def decodePlate(preds):
    pre=0
    newPreds=[]
    index=[]
    for i in range(len(preds)):
        if preds[i]!=0 and preds[i]!=pre:
            newPreds.append(preds[i])
            index.append(i)
        pre=preds[i]
    return newPreds,index

def decodePlateMulti(preds_list, probs_list):
    """
    解码多个候选序列
    preds_list: List[np.ndarray], 每个元素是一个预测序列
    probs_list: List[np.ndarray], 每个元素是对应的概率序列
    """
    results = []
    for preds, probs in zip(preds_list, probs_list):
        pre = 0
        newPreds = []
        index = []
        for i in range(len(preds)):
            if preds[i] != 0 and preds[i] != pre:
                newPreds.append(preds[i])
                index.append(i)
            pre = preds[i]
        results.append((newPreds, index, probs[index] if len(index) > 0 else np.array([])))
    return results

def image_processing(img,device):
    img = cv2.resize(img, (168,48))
    img = np.reshape(img, (48, 168, 3))

    # normalize
    img = img.astype(np.float32)
    img = (img / 255. - mean_value) / std_value
    img = img.transpose([2, 0, 1])
    img = torch.from_numpy(img)

    img = img.to(device)
    img = img.view(1, *img.size())
    return img

def get_plate_result(img,device,model,is_color=False):
    input = image_processing(img,device)
    if is_color:  #是否识别颜色
        preds,color_preds = model(input)
        color_preds = torch.softmax(color_preds,dim=-1)
        color_conf,color_index = torch.max(color_preds,dim=-1)
        color_conf=color_conf.item()
    else:
        preds = model(input)
    preds=torch.softmax(preds,dim=-1)
    prob,index=preds.max(dim=-1)
    index = index.view(-1).detach().cpu().numpy()
    prob=prob.view(-1).detach().cpu().numpy()
   
    
    # preds=preds.view(-1).detach().cpu().numpy()
    newPreds,new_index=decodePlate(index)
    prob=prob[new_index]
    plate=""
    for i in newPreds:
        plate+=plateName[i]
    # if not (plate[0] in plateName[1:44] ):
    #     return ""
    if is_color:
        return plate,prob,color[color_index],color_conf    #返回车牌号以及每个字符的概率,以及颜色，和颜色的概率
    else:
        return plate,prob

def get_plate_result_multiple(img, device, model, is_color=False, top_k=5, beam_width=5, min_confidence=0.3):
    """
    获取多个候选车牌识别结果
    
    参数:
        img: 输入图像
        device: 设备
        model: 识别模型
        is_color: 是否识别颜色
        top_k: 返回的候选结果数量
        beam_width: beam search的宽度
        min_confidence: 最小置信度阈值
    
    返回:
        如果is_color=True: (candidates, color_info)
            candidates: List[Dict] 每个元素包含 {'plate': str, 'confidence': float, 'char_probs': np.ndarray}
            color_info: Dict 包含 {'color': str, 'confidence': float}
        如果is_color=False: candidates
    """
    input_tensor = image_processing(img, device)
    
    # 获取模型预测（模型使用export=True，返回logits）
    if is_color:
        preds, color_preds = model(input_tensor)
        color_preds = torch.softmax(color_preds, dim=-1)
        color_conf, color_index = torch.max(color_preds, dim=-1)
        color_conf = color_conf.item()
        color_info = {'color': color[color_index], 'confidence': color_conf}
    else:
        preds = model(input_tensor)
        color_info = None
    
    # 模型在export模式下返回的是logits，格式为 (seq_len, batch_size, num_classes)
    # 其中batch_size=1，所以需要squeeze掉batch维度
    if preds.dim() == 3:
        # (seq_len, batch_size, num_classes) -> (seq_len, num_classes)
        preds = preds.squeeze(1)
    elif preds.dim() == 2:
        # 已经是 (seq_len, num_classes)
        pass
    else:
        raise ValueError(f"Unexpected preds shape: {preds.shape}")
    
    # 获取概率分布
    preds = torch.softmax(preds, dim=-1)  # (seq_len, num_classes)
    
    # 转换为numpy
    preds_np = preds.detach().cpu().numpy()
    
    # 使用beam search获取多个候选序列
    candidates = beam_search_decode(preds_np, plateName, beam_width=beam_width, top_k=top_k)
    
    # 过滤低置信度的候选
    filtered_candidates = []
    for candidate in candidates:
        if candidate['confidence'] >= min_confidence:
            filtered_candidates.append(candidate)
    
    # 如果所有候选都被过滤，至少返回置信度最高的一个
    if not filtered_candidates and candidates:
        filtered_candidates = [candidates[0]]
    
    if is_color:
        return filtered_candidates, color_info
    else:
        return filtered_candidates

def beam_search_decode(probs, plate_name, beam_width=5, top_k=5):
    """
    Beam search解码，生成多个候选序列
    
    参数:
        probs: (seq_len, num_classes) 每个位置每个字符的概率
        plate_name: 字符集字符串
        beam_width: beam search宽度
        top_k: 返回的top-k结果
    
    返回:
        List[Dict] 每个元素包含 {'plate': str, 'confidence': float, 'char_probs': np.ndarray}
    """
    seq_len, num_classes = probs.shape
    blank_id = 0  # 空白字符的ID
    
    # 初始化beam: (sequence, log_prob, last_char)
    # sequence是字符ID列表，last_char是上一个非空白字符
    beams = [([], 0.0, blank_id)]
    
    for t in range(seq_len):
        new_beams = []
        char_probs = probs[t]
        
        for sequence, log_prob, last_char in beams:
            # 获取当前时刻top-k字符
            top_k_chars = np.argsort(char_probs)[-beam_width:][::-1]
            
            for char_id in top_k_chars:
                char_prob = char_probs[char_id]
                new_log_prob = log_prob + np.log(char_prob + 1e-10)
                
                if char_id == blank_id:
                    # 空白字符，不添加到序列
                    new_beams.append((sequence, new_log_prob, last_char))
                elif char_id == last_char:
                    # 重复字符，不添加（CTC的去重逻辑）
                    new_beams.append((sequence, new_log_prob, last_char))
                else:
                    # 新字符，添加到序列
                    new_sequence = sequence + [char_id]
                    new_beams.append((new_sequence, new_log_prob, char_id))
        
        # 保留top beam_width个beam
        beams = sorted(new_beams, key=lambda x: x[1], reverse=True)[:beam_width]
    
    # 转换为字符串并计算置信度
    candidates = []
    for sequence, log_prob, _ in beams:
        if not sequence:
            continue
        
        # 计算每个字符的概率
        char_probs_list = []
        plate_str = ""
        for char_id in sequence:
            plate_str += plate_name[char_id]
            # 找到该字符在序列中的位置（简化处理，使用平均概率）
            char_probs_list.append(np.max(probs[:, char_id]))
        
        # 计算总体置信度（使用几何平均）
        confidence = np.exp(log_prob / len(sequence)) if sequence else 0.0
        
        candidates.append({
            'plate': plate_str,
            'confidence': float(confidence),
            'char_probs': np.array(char_probs_list),
            'log_prob': float(log_prob)
        })
    
    # 按置信度排序
    candidates.sort(key=lambda x: x['confidence'], reverse=True)
    
    # 返回top_k个结果
    return candidates[:top_k]

def init_model(device,model_path,is_color = False):
    # print( print(sys.path))
    # model_path ="plate_recognition/model/checkpoint_61_acc_0.9715.pth"
    check_point = torch.load(model_path,map_location=device,weights_only=False)
    model_state=check_point['state_dict']
    cfg=check_point['cfg']
    color_classes=0
    if is_color:
        color_classes=5           #颜色类别数
    model = myNet_ocr_color(num_classes=len(plateName),export=True,cfg=cfg,color_num=color_classes)
   
    model.load_state_dict(model_state,strict=False)
    model.to(device)
    model.eval()
    return model

# model = init_model(device)
if __name__ == '__main__':
   model_path = r"weights/plate_rec_color.pth"
   image_path ="images/tmp2424.png"
   testPath = r"/mnt/Gpan/Mydata/pytorchPorject/CRNN/crnn_plate_recognition/images"
   fileList=[]
   allFilePath(testPath,fileList)
#    result = get_plate_result(image_path,device)
#    print(result)
   is_color = False
   model = init_model(device,model_path,is_color=is_color)
   right=0
   begin = time.time()
   
   for imge_path in fileList:
        img=cv2.imread(imge_path)
        if is_color:
            plate,_,plate_color,_=get_plate_result(img,device,model,is_color=is_color)
            print(plate)
        else:
            plate,_=get_plate_result(img,device,model,is_color=is_color)
            print(plate,imge_path)
        
  
        
