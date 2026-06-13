# -*- coding: UTF-8 -*-
"""
车牌识别系统 - 图形化界面
支持图片和视频的车牌检测与识别
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
from PIL import Image, ImageTk
import cv2
import torch
import os
import threading
import time
from pathlib import Path

# 导入检测和识别模块
from detect_plate import load_model, detect_Recognition_plate, draw_result
from plate_recognition.plate_rec import init_model, cv_imread
import numpy as np


class PlateRecognitionGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("车牌识别系统 - Plate Recognition System")
        self.root.geometry("1400x800")  # 增加窗口宽度以容纳三栏布局
        self.root.resizable(True, True)
        
        # 设置主题颜色
        self.bg_color = "#f0f0f0"
        self.primary_color = "#2196F3"
        self.success_color = "#4CAF50"
        self.root.configure(bg=self.bg_color)
        
        # 初始化变量
        self.detect_model = None
        self.plate_rec_model = None
        self.device = None
        self.current_image = None
        self.current_image_path = None
        self.is_processing = False
        self.batch_results = []  # 存储批量处理的结果
        self.current_batch_index = 0  # 当前浏览的批量结果索引
        self.is_overview_mode = False  # 是否处于总览模式
        self.overview_frame = None  # 总览框架
        
        # 创建界面
        self.create_widgets()
        
        # 自动加载模型
        self.load_models()
    
    def create_widgets(self):
        """创建界面组件"""
        
        # 标题栏
        title_frame = tk.Frame(self.root, bg=self.primary_color, height=60)
        title_frame.pack(fill=tk.X, side=tk.TOP)
        
        title_label = tk.Label(
            title_frame, 
            text="🚗 中国车牌识别系统", 
            font=("微软雅黑", 20, "bold"),
            bg=self.primary_color,
            fg="white"
        )
        title_label.pack(pady=15)
        
        # 主容器
        main_container = tk.Frame(self.root, bg=self.bg_color)
        main_container.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # 左侧面板 - 功能按钮区
        left_panel = tk.Frame(main_container, bg="white", relief=tk.RAISED, borderwidth=2)
        left_panel.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 5))
        
        # 功能按钮区
        self.create_control_panel(left_panel)
        
        # 中间面板 - 图像显示区
        center_panel = tk.Frame(main_container, bg="white", relief=tk.RAISED, borderwidth=2)
        center_panel.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        
        # 图像显示区
        self.create_image_panel(center_panel)
        
        # 右侧面板 - 设置和结果显示区
        right_panel = tk.Frame(main_container, bg="white", relief=tk.RAISED, borderwidth=2)
        right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, padx=(5, 0))
        right_panel.config(width=350)  # 设置固定宽度，确保设置选项能完整显示
        
        # 设置区（在顶部）
        self.create_settings_panel(right_panel)
        
        # 结果显示区（在底部，占用剩余空间）
        self.create_result_panel(right_panel)
        
        # 状态栏
        self.create_status_bar()
    
    def create_control_panel(self, parent):
        """创建控制面板"""
        
        # 标题
        control_title = tk.Label(
            parent, 
            text="控制面板", 
            font=("微软雅黑", 14, "bold"),
            bg="white"
        )
        control_title.pack(pady=15)
        
        # 按钮样式
        button_style = {
            "font": ("微软雅黑", 11),
            "width": 20,
            "height": 2,
            "relief": tk.RAISED,
            "borderwidth": 2
        }
        
        # 选择图片按钮
        self.btn_select_image = tk.Button(
            parent,
            text="📁 选择图片",
            bg="#2196F3",
            fg="white",
            command=self.select_image,
            **button_style
        )
        self.btn_select_image.pack(pady=10, padx=20)
        
        # 选择文件夹按钮
        self.btn_select_folder = tk.Button(
            parent,
            text="📂 批量识别(文件夹)",
            bg="#FF9800",
            fg="white",
            command=self.select_folder,
            **button_style
        )
        self.btn_select_folder.pack(pady=10, padx=20)
        
        # 选择视频按钮
        self.btn_select_video = tk.Button(
            parent,
            text="🎬 选择视频",
            bg="#9C27B0",
            fg="white",
            command=self.select_video,
            **button_style
        )
        self.btn_select_video.pack(pady=10, padx=20)
        
        # 开始识别按钮
        self.btn_recognize = tk.Button(
            parent,
            text="▶ 开始识别",
            bg="#4CAF50",
            fg="white",
            command=self.start_recognition,
            state=tk.DISABLED,
            **button_style
        )
        self.btn_recognize.pack(pady=10, padx=20)
        
        # 保存结果按钮
        self.btn_save = tk.Button(
            parent,
            text="💾 保存结果",
            bg="#607D8B",
            fg="white",
            command=self.save_result,
            state=tk.DISABLED,
            **button_style
        )
        self.btn_save.pack(pady=10, padx=20)
        
        # 清空按钮
        self.btn_clear = tk.Button(
            parent,
            text="🗑️ 清空",
            bg="#F44336",
            fg="white",
            command=self.clear_all,
            **button_style
        )
        self.btn_clear.pack(pady=10, padx=20)
        
        # 关于信息
        about_frame = tk.Frame(parent, bg="white")
        about_frame.pack(side=tk.BOTTOM, pady=20)
        
        about_text = "支持12种中文车牌类型\n单层/双层车牌识别\nYOLOv5 + CRNN"
        about_label = tk.Label(
            about_frame,
            text=about_text,
            font=("微软雅黑", 9),
            bg="white",
            fg="gray",
            justify=tk.CENTER
        )
        about_label.pack()
    
    def create_settings_panel(self, parent):
        """创建设置面板"""
        
        # 设置区域框架
        settings_frame = tk.LabelFrame(
            parent,
            text="⚙️ 设置",
            font=("微软雅黑", 11, "bold"),
            bg="white",
            relief=tk.GROOVE,
            borderwidth=2
        )
        settings_frame.pack(fill=tk.X, padx=8, pady=8)
        
        # 内部容器，添加内边距
        settings_inner = tk.Frame(settings_frame, bg="white")
        settings_inner.pack(fill=tk.BOTH, expand=True, padx=8, pady=8)
        
        # 是否识别颜色
        self.var_color = tk.BooleanVar(value=True)
        color_check = tk.Checkbutton(
            settings_inner,
            text="识别车牌颜色",
            variable=self.var_color,
            font=("微软雅黑", 9),
            bg="white",
            anchor="w"
        )
        color_check.pack(fill=tk.X, pady=3)
        
        # 多候选识别设置
        self.var_multiple_candidates = tk.BooleanVar(value=True)
        multiple_check = tk.Checkbutton(
            settings_inner,
            text="多候选识别（极端情况）",
            variable=self.var_multiple_candidates,
            font=("微软雅黑", 9),
            bg="white",
            anchor="w"
        )
        multiple_check.pack(fill=tk.X, pady=3)
        
        # 图像增强设置
        self.var_use_enhancement = tk.BooleanVar(value=True)
        enhancement_check = tk.Checkbutton(
            settings_inner,
            text="自动图像增强",
            variable=self.var_use_enhancement,
            font=("微软雅黑", 9),
            bg="white",
            anchor="w"
        )
        enhancement_check.pack(fill=tk.X, pady=3)
        
        # 分隔线
        separator1 = ttk.Separator(settings_inner, orient='horizontal')
        separator1.pack(fill=tk.X, pady=8)
        
        # 候选数量设置
        candidate_frame = tk.Frame(settings_inner, bg="white")
        candidate_frame.pack(fill=tk.X, pady=3)
        
        tk.Label(candidate_frame, text="候选数量:", font=("微软雅黑", 9), bg="white").pack(side=tk.LEFT)
        self.var_top_k = tk.StringVar(value="5")
        top_k_combo = ttk.Combobox(
            candidate_frame,
            textvariable=self.var_top_k,
            values=["3", "5", "8", "10"],
            width=6,
            state="readonly",
            font=("微软雅黑", 9)
        )
        top_k_combo.pack(side=tk.RIGHT)
        
        # 最小置信度设置
        confidence_frame = tk.Frame(settings_inner, bg="white")
        confidence_frame.pack(fill=tk.X, pady=3)
        
        tk.Label(confidence_frame, text="最小置信度:", font=("微软雅黑", 9), bg="white").pack(side=tk.LEFT)
        self.var_min_confidence = tk.StringVar(value="0.3")
        confidence_combo = ttk.Combobox(
            confidence_frame,
            textvariable=self.var_min_confidence,
            values=["0.1", "0.2", "0.3", "0.4", "0.5"],
            width=6,
            state="readonly",
            font=("微软雅黑", 9)
        )
        confidence_combo.pack(side=tk.RIGHT)
        
        # 图像大小设置
        size_frame = tk.Frame(settings_inner, bg="white")
        size_frame.pack(fill=tk.X, pady=3)
        
        tk.Label(size_frame, text="图像尺寸:", font=("微软雅黑", 9), bg="white").pack(side=tk.LEFT)
        self.var_img_size = tk.StringVar(value="640")
        size_combo = ttk.Combobox(
            size_frame,
            textvariable=self.var_img_size,
            values=["320", "416", "640", "1280"],
            width=6,
            state="readonly",
            font=("微软雅黑", 9)
        )
        size_combo.pack(side=tk.RIGHT)
        
        # 分隔线
        separator2 = ttk.Separator(settings_inner, orient='horizontal')
        separator2.pack(fill=tk.X, pady=8)
        
        # 检测置信度设置（用于极端情况）
        detect_conf_frame = tk.Frame(settings_inner, bg="white")
        detect_conf_frame.pack(fill=tk.X, pady=3)
        
        tk.Label(detect_conf_frame, text="检测阈值:", font=("微软雅黑", 9), bg="white").pack(side=tk.LEFT)
        self.var_detect_conf = tk.StringVar(value="0.3")
        detect_conf_combo = ttk.Combobox(
            detect_conf_frame,
            textvariable=self.var_detect_conf,
            values=["0.1", "0.15", "0.2", "0.25", "0.3", "0.35", "0.4"],
            width=6,
            state="readonly",
            font=("微软雅黑", 9)
        )
        detect_conf_combo.pack(side=tk.RIGHT)
        
        # 检测增强设置
        self.var_use_detect_enhancement = tk.BooleanVar(value=True)
        detect_enhancement_check = tk.Checkbutton(
            settings_inner,
            text="检测前图像增强",
            variable=self.var_use_detect_enhancement,
            font=("微软雅黑", 9),
            bg="white",
            anchor="w"
        )
        detect_enhancement_check.pack(fill=tk.X, pady=3)
    
    def create_image_panel(self, parent):
        """创建图像显示面板"""
        
        image_frame = tk.LabelFrame(
            parent,
            text="图像显示",
            font=("微软雅黑", 12, "bold"),
            bg="white",
            relief=tk.GROOVE,
            borderwidth=2
        )
        image_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # 导航按钮容器
        nav_frame = tk.Frame(image_frame, bg="white")
        nav_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # 上一张按钮
        self.btn_prev = tk.Button(
            nav_frame,
            text="◀ 上一张",
            font=("微软雅黑", 10),
            bg="#2196F3",
            fg="white",
            command=self.show_previous_image,
            state=tk.DISABLED,
            width=10
        )
        self.btn_prev.pack(side=tk.LEFT, padx=5)
        
        # 图片信息标签
        self.image_info_label = tk.Label(
            nav_frame,
            text="",
            font=("微软雅黑", 10),
            bg="white",
            fg="black"
        )
        self.image_info_label.pack(side=tk.LEFT, expand=True)
        
        # 总览按钮
        self.btn_overview = tk.Button(
            nav_frame,
            text="📋 总览",
            font=("微软雅黑", 10),
            bg="#FF9800",
            fg="white",
            command=self.show_overview,
            state=tk.DISABLED,
            width=10
        )
        self.btn_overview.pack(side=tk.LEFT, padx=5)
        
        # 下一张按钮
        self.btn_next = tk.Button(
            nav_frame,
            text="下一张 ▶",
            font=("微软雅黑", 10),
            bg="#2196F3",
            fg="white",
            command=self.show_next_image,
            state=tk.DISABLED,
            width=10
        )
        self.btn_next.pack(side=tk.LEFT, padx=5)
        
        # 创建一个容器来容纳图像显示和总览
        self.display_container = tk.Frame(image_frame, bg="white")
        self.display_container.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # 图像显示标签
        self.image_label = tk.Label(
            self.display_container,
            text="请选择图片或视频\n支持格式: JPG, PNG, MP4",
            font=("微软雅黑", 14),
            bg="white",
            fg="gray"
        )
        self.image_label.pack(fill=tk.BOTH, expand=True)
    
    def create_result_panel(self, parent):
        """创建结果显示面板"""
        
        result_frame = tk.LabelFrame(
            parent,
            text="识别结果",
            font=("微软雅黑", 12, "bold"),
            bg="white",
            relief=tk.GROOVE,
            borderwidth=2
        )
        result_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=(0, 10))
        
        # 结果文本框
        self.result_text = scrolledtext.ScrolledText(
            result_frame,
            height=15,
            font=("Consolas", 10),
            bg="#f9f9f9",
            wrap=tk.WORD
        )
        self.result_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
    
    def create_status_bar(self):
        """创建状态栏"""
        
        status_frame = tk.Frame(self.root, bg="#263238", height=30)
        status_frame.pack(fill=tk.X, side=tk.BOTTOM)
        
        self.status_label = tk.Label(
            status_frame,
            text="就绪",
            font=("微软雅黑", 9),
            bg="#263238",
            fg="white",
            anchor=tk.W
        )
        self.status_label.pack(side=tk.LEFT, padx=10)
        
        # 模型状态指示
        self.model_status_label = tk.Label(
            status_frame,
            text="模型: 未加载",
            font=("微软雅黑", 9),
            bg="#263238",
            fg="#FF9800",
            anchor=tk.E
        )
        self.model_status_label.pack(side=tk.RIGHT, padx=10)
    
    def load_models(self):
        """加载模型"""
        
        self.update_status("正在加载模型...")
        self.model_status_label.config(text="模型: 加载中...", fg="#FF9800")
        
        def load():
            try:
                # 设置设备
                self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
                
                # 加载检测模型
                detect_model_path = "weights/plate_detect.pt"
                if not os.path.exists(detect_model_path):
                    raise FileNotFoundError(f"检测模型文件不存在: {detect_model_path}")
                
                self.detect_model = load_model(detect_model_path, self.device)
                
                # 加载识别模型
                rec_model_path = "weights/plate_rec_color.pth"
                if not os.path.exists(rec_model_path):
                    raise FileNotFoundError(f"识别模型文件不存在: {rec_model_path}")
                
                self.plate_rec_model = init_model(self.device, rec_model_path, is_color=True)
                
                # 更新状态
                device_name = "GPU" if torch.cuda.is_available() else "CPU"
                self.update_status(f"模型加载成功 (使用 {device_name})")
                self.model_status_label.config(text=f"模型: 已加载 ({device_name})", fg="#4CAF50")
                
                # 启用按钮
                self.btn_select_image.config(state=tk.NORMAL)
                self.btn_select_folder.config(state=tk.NORMAL)
                self.btn_select_video.config(state=tk.NORMAL)
                
            except Exception as e:
                error_msg = f"模型加载失败: {str(e)}"
                self.update_status(error_msg)
                self.model_status_label.config(text="模型: 加载失败", fg="#F44336")
                messagebox.showerror("错误", error_msg)
        
        # 在后台线程加载
        threading.Thread(target=load, daemon=True).start()
    
    def select_image(self):
        """选择图片"""
        
        file_path = filedialog.askopenfilename(
            title="选择图片",
            filetypes=[
                ("图片文件", "*.jpg *.jpeg *.png *.bmp"),
                ("所有文件", "*.*")
            ]
        )
        
        if file_path:
            self.current_image_path = file_path
            self.display_image(file_path)
            self.btn_recognize.config(state=tk.NORMAL)
            self.update_status(f"已选择: {os.path.basename(file_path)}")
            self.log_result(f"选择图片: {file_path}\n")
    
    def select_folder(self):
        """选择文件夹进行批量识别"""
        
        folder_path = filedialog.askdirectory(title="选择包含图片的文件夹")
        
        if folder_path:
            self.current_image_path = folder_path
            self.update_status(f"已选择文件夹: {os.path.basename(folder_path)}")
            self.log_result(f"选择文件夹: {folder_path}\n")
            self.btn_recognize.config(state=tk.NORMAL)
            
            # 显示文件夹信息
            image_files = [f for f in os.listdir(folder_path) 
                          if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp'))]
            self.log_result(f"找到 {len(image_files)} 张图片\n")
            
            # 预览第一张图片（未识别状态）
            if image_files:
                first_image_path = os.path.join(folder_path, image_files[0])
                self.display_image(first_image_path)
                self.log_result(f"预览: {image_files[0]}\n")
                self.image_info_label.config(text=f"预览 - {image_files[0]} (未识别)")
    
    def select_video(self):
        """选择视频"""
        
        file_path = filedialog.askopenfilename(
            title="选择视频",
            filetypes=[
                ("视频文件", "*.mp4 *.avi *.mov *.mkv"),
                ("所有文件", "*.*")
            ]
        )
        
        if file_path:
            self.current_image_path = file_path
            self.btn_recognize.config(state=tk.NORMAL)
            self.update_status(f"已选择视频: {os.path.basename(file_path)}")
            self.log_result(f"选择视频: {file_path}\n")
            
            # 显示视频第一帧
            cap = cv2.VideoCapture(file_path)
            ret, frame = cap.read()
            if ret:
                self.display_cv_image(frame)
            cap.release()
    
    def start_recognition(self):
        """开始识别"""
        
        if not self.current_image_path:
            messagebox.showwarning("警告", "请先选择图片、文件夹或视频")
            return
        
        if self.is_processing:
            messagebox.showinfo("提示", "正在处理中，请稍候...")
            return
        
        # 禁用按钮
        self.btn_recognize.config(state=tk.DISABLED)
        self.is_processing = True
        
        # 在后台线程处理
        threading.Thread(target=self.process_recognition, daemon=True).start()
    
    def process_recognition(self):
        """处理识别（后台线程）"""
        
        try:
            path = self.current_image_path
            img_size = int(self.var_img_size.get())
            is_color = self.var_color.get()
            
            # 判断是文件还是文件夹
            if os.path.isfile(path):
                # 单个文件
                if path.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
                    self.process_single_image(path, img_size, is_color)
                elif path.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
                    self.process_video(path, img_size, is_color)
            elif os.path.isdir(path):
                # 文件夹批量处理
                self.process_folder(path, img_size, is_color)
            
        except Exception as e:
            self.update_status(f"识别失败: {str(e)}")
            messagebox.showerror("错误", f"识别过程出错:\n{str(e)}")
        
        finally:
            self.is_processing = False
            self.btn_recognize.config(state=tk.NORMAL)
    
    def process_single_image(self, image_path, img_size, is_color):
        """处理单张图片"""
        
        self.update_status("正在识别...")
        start_time = time.time()
        
        # 清空批量结果（单张识别时不应保留批量结果）
        self.batch_results = []
        
        # 如果在总览模式，退出总览
        if self.is_overview_mode:
            self.hide_overview()
        
        # 禁用导航按钮
        self.btn_prev.config(state=tk.DISABLED)
        self.btn_next.config(state=tk.DISABLED)
        self.btn_overview.config(state=tk.DISABLED)
        self.image_info_label.config(text="")
        
        # 读取图片
        img = cv_imread(image_path)
        if img is None:
            raise ValueError("无法读取图片")
        
        if img.shape[-1] == 4:
            img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
        
        # 获取设置
        use_multiple = self.var_multiple_candidates.get()
        use_enhancement = self.var_use_enhancement.get()
        top_k = int(self.var_top_k.get())
        min_confidence = float(self.var_min_confidence.get())
        detect_conf_thres = float(self.var_detect_conf.get())
        use_detect_enhancement = self.var_use_detect_enhancement.get()
        
        # 检测和识别
        dict_list = detect_Recognition_plate(
            self.detect_model, 
            img, 
            self.device,
            self.plate_rec_model,
            img_size,
            is_color=is_color,
            use_multiple_candidates=use_multiple,
            top_k=top_k,
            min_confidence=min_confidence,
            use_enhancement=use_enhancement,
            detect_conf_thres=detect_conf_thres,
            use_detect_enhancement=use_detect_enhancement
        )
        
        # 绘制结果（需要复制图像，因为draw_result会修改原图）
        result_img = img.copy()
        result_img = draw_result(result_img, dict_list, is_color=is_color, show_candidates=use_multiple)
        self.current_image = result_img
        
        # 显示结果
        self.display_cv_image(result_img)
        
        # 记录结果
        elapsed_time = time.time() - start_time
        self.log_result(f"\n{'='*50}\n")
        self.log_result(f"图片: {os.path.basename(image_path)}\n")
        self.log_result(f"识别时间: {elapsed_time:.2f}秒\n")
        self.log_result(f"检测到 {len(dict_list)} 个车牌:\n\n")
        
        for i, result in enumerate(dict_list, 1):
            plate_no = result['plate_no']
            detect_conf = result['detect_conf']
            plate_color = result.get('plate_color', '')
            plate_type = "双层" if result['plate_type'] == 1 else "单层"
            
            self.log_result(f"车牌 {i}:\n")
            self.log_result(f"  最佳车牌号: {plate_no}\n")
            self.log_result(f"  颜色: {plate_color}\n")
            self.log_result(f"  类型: {plate_type}\n")
            self.log_result(f"  检测置信度: {detect_conf:.3f}\n")
            
            # 如果有多候选结果，显示所有候选
            if use_multiple and 'candidates' in result and len(result['candidates']) > 0:
                candidates = result['candidates']
                self.log_result(f"  识别置信度: {candidates[0]['confidence']:.3f}\n")
                self.log_result(f"  候选结果 ({len(candidates)} 个):\n")
                
                for j, candidate in enumerate(candidates, 1):
                    conf = candidate['confidence']
                    plate = candidate['plate']
                    enhancement_flag = " [增强]" if candidate.get('enhancement', False) else ""
                    self.log_result(f"    {j}. {plate} - 置信度: {conf:.3f}{enhancement_flag}\n")
                
                # 显示图像质量信息
                if 'quality_info' in result:
                    quality = result['quality_info']
                    self.log_result(f"  图像质量评分: {quality['quality_score']:.3f}\n")
                    if any(quality['needs_enhancement'].values()):
                        self.log_result(f"  质量提示: ")
                        if quality['needs_enhancement']['low_brightness']:
                            self.log_result(f"亮度不足 ")
                        if quality['needs_enhancement']['low_contrast']:
                            self.log_result(f"对比度低 ")
                        if quality['needs_enhancement']['blurry']:
                            self.log_result(f"图像模糊 ")
                        self.log_result(f"\n")
            else:
                # 单候选结果
                if 'rec_conf' in result and len(result['rec_conf']) > 0:
                    avg_rec_conf = float(np.mean(result['rec_conf']))
                    self.log_result(f"  识别置信度: {avg_rec_conf:.3f}\n")
            
            self.log_result(f"\n")
        
        self.update_status(f"识别完成! 用时 {elapsed_time:.2f}秒")
        self.btn_save.config(state=tk.NORMAL)
    
    def process_folder(self, folder_path, img_size, is_color):
        """批量处理文件夹"""
        
        image_files = [f for f in os.listdir(folder_path) 
                      if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp'))]
        
        if not image_files:
            messagebox.showwarning("警告", "文件夹中没有找到图片文件")
            return
        
        self.log_result(f"\n开始批量处理 {len(image_files)} 张图片...\n\n")
        
        # 获取设置
        use_multiple = self.var_multiple_candidates.get()
        use_enhancement = self.var_use_enhancement.get()
        top_k = int(self.var_top_k.get())
        min_confidence = float(self.var_min_confidence.get())
        detect_conf_thres = float(self.var_detect_conf.get())
        use_detect_enhancement = self.var_use_detect_enhancement.get()
        
        # 清空之前的批量结果
        self.batch_results = []
        
        total_plates = 0
        for i, filename in enumerate(image_files, 1):
            image_path = os.path.join(folder_path, filename)
            self.update_status(f"处理中... ({i}/{len(image_files)})")
            
            try:
                img = cv_imread(image_path)
                if img is None:
                    continue
                
                if img.shape[-1] == 4:
                    img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
                
                dict_list = detect_Recognition_plate(
                    self.detect_model, 
                    img, 
                    self.device,
                    self.plate_rec_model,
                    img_size,
                    is_color=is_color,
                    use_multiple_candidates=use_multiple,
                    top_k=top_k,
                    min_confidence=min_confidence,
                    use_enhancement=use_enhancement,
                    detect_conf_thres=detect_conf_thres,
                    use_detect_enhancement=use_detect_enhancement
                )
                
                # 绘制结果并保存到批量结果列表（需要复制图像）
                result_img = img.copy()
                result_img = draw_result(result_img, dict_list, is_color=is_color, show_candidates=use_multiple)
                self.batch_results.append({
                    'filename': filename,
                    'image': result_img,
                    'plates': dict_list
                })
                
                if dict_list:
                    total_plates += len(dict_list)
                    self.log_result(f"{filename}: ")
                    for result in dict_list:
                        plate_no = result['plate_no']
                        plate_color = result.get('plate_color', '')
                        # 如果有多候选，显示最佳结果和置信度
                        if use_multiple and 'candidates' in result and len(result['candidates']) > 0:
                            best_conf = result['candidates'][0]['confidence']
                            self.log_result(f"{plate_no} ({plate_color}, {best_conf:.2f}) ")
                        else:
                            self.log_result(f"{plate_no} ({plate_color}) ")
                    self.log_result("\n")
                else:
                    self.log_result(f"{filename}: 未检测到车牌\n")
            
            except Exception as e:
                self.log_result(f"{filename}: 处理失败 - {str(e)}\n")
        
        self.log_result(f"\n批量处理完成! 共识别 {total_plates} 个车牌\n")
        self.update_status(f"批量处理完成! 共 {len(image_files)} 张图片, {total_plates} 个车牌")
        
        # 启用保存按钮和导航按钮
        if self.batch_results:
            self.btn_save.config(state=tk.NORMAL)
            self.log_result(f"点击 '💾 保存结果' 按钮可批量保存所有识别结果\n")
            
            # 启用导航按钮（至少2张图片时）
            if len(self.batch_results) >= 2:
                self.update_navigation_buttons()
                self.log_result(f"使用 '上一张/下一张' 浏览识别结果\n")
            
            # 显示第一张图片
            self.current_batch_index = 0
            self.display_batch_image(0)
    
    def process_video(self, video_path, img_size, is_color):
        """处理视频"""
        
        # 清空批量结果和当前图像（视频处理不保存图片）
        self.batch_results = []
        self.current_image = None
        
        self.update_status("正在处理视频...")
        self.log_result(f"\n开始处理视频: {os.path.basename(video_path)}\n")
        
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError("无法打开视频文件")
            
            # 获取视频信息
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            
            self.log_result(f"视频信息:\n")
            self.log_result(f"  分辨率: {width}x{height}\n")
            self.log_result(f"  帧率: {fps} FPS\n")
            self.log_result(f"  总帧数: {frame_count}\n")
            self.log_result(f"  时长: {frame_count/fps:.1f}秒\n\n")
            
            # 询问是否保存视频
            save_video = messagebox.askyesno(
                "保存视频", 
                f"视频共 {frame_count} 帧，处理需要一定时间\n\n是否保存处理后的视频？\n\n点击'否'将只显示识别结果"
            )
            
            out = None
            if save_video:
                output_path = filedialog.asksaveasfilename(
                    title="保存视频",
                    defaultextension=".mp4",
                    filetypes=[("MP4视频", "*.mp4"), ("AVI视频", "*.avi")]
                )
                
                if output_path:
                    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
            # 处理视频帧
            frame_idx = 0
            total_plates = 0
            process_interval = max(1, fps // 2)  # 每秒处理2帧，提高速度
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_idx += 1
                
                # 每隔几帧处理一次
                if frame_idx % process_interval == 0:
                    self.update_status(f"处理视频... 帧 {frame_idx}/{frame_count}")
                    
                    # 获取设置
                    use_multiple = self.var_multiple_candidates.get()
                    use_enhancement = self.var_use_enhancement.get()
                    top_k = int(self.var_top_k.get())
                    min_confidence = float(self.var_min_confidence.get())
                    detect_conf_thres = float(self.var_detect_conf.get())
                    use_detect_enhancement = self.var_use_detect_enhancement.get()
                    
                    # 检测和识别
                    dict_list = detect_Recognition_plate(
                        self.detect_model,
                        frame,
                        self.device,
                        self.plate_rec_model,
                        img_size,
                        is_color=is_color,
                        use_multiple_candidates=use_multiple,
                        top_k=top_k,
                        min_confidence=min_confidence,
                        use_enhancement=use_enhancement,
                        detect_conf_thres=detect_conf_thres,
                        use_detect_enhancement=use_detect_enhancement
                    )
                    
                    if dict_list:
                        total_plates += len(dict_list)
                        
                        # 记录识别结果
                        self.log_result(f"帧 {frame_idx}: ")
                        for result in dict_list:
                            plate_no = result['plate_no']
                            plate_color = result.get('plate_color', '')
                            # 如果有多候选，显示最佳结果和置信度
                            if use_multiple and 'candidates' in result and len(result['candidates']) > 0:
                                best_conf = result['candidates'][0]['confidence']
                                self.log_result(f"{plate_no} ({plate_color}, {best_conf:.2f}) ")
                            else:
                                self.log_result(f"{plate_no} ({plate_color}) ")
                        self.log_result("\n")
                        
                        # 绘制结果
                        frame = draw_result(frame, dict_list, is_color=is_color, show_candidates=use_multiple)
                    
                    # 显示当前帧
                    if frame_idx % (process_interval * 5) == 0:  # 每处理5帧更新一次显示
                        self.display_cv_image(frame)
                
                # 保存视频帧
                if out is not None:
                    out.write(frame)
            
            cap.release()
            if out is not None:
                out.release()
            
            self.log_result(f"\n视频处理完成!\n")
            self.log_result(f"  处理帧数: {frame_idx}\n")
            self.log_result(f"  识别车牌: {total_plates} 个\n")
            if save_video and output_path:
                self.log_result(f"  保存位置: {output_path}\n")
            
            self.update_status(f"视频处理完成! 共识别 {total_plates} 个车牌")
            messagebox.showinfo("完成", f"视频处理完成!\n共识别 {total_plates} 个车牌")
            
        except Exception as e:
            error_msg = f"视频处理失败: {str(e)}"
            self.log_result(f"\n{error_msg}\n")
            messagebox.showerror("错误", error_msg)
        
        finally:
            if 'cap' in locals():
                cap.release()
            if 'out' in locals() and out is not None:
                out.release()
    
    def display_image(self, image_path):
        """显示图片"""
        
        try:
            # 读取图片
            img = Image.open(image_path)
            
            # 调整大小以适应显示区域
            display_size = (700, 500)
            img.thumbnail(display_size, Image.Resampling.LANCZOS)
            
            # 转换为 PhotoImage
            photo = ImageTk.PhotoImage(img)
            
            # 更新显示
            self.image_label.config(image=photo, text="")
            self.image_label.image = photo  # 保持引用
            
        except Exception as e:
            messagebox.showerror("错误", f"无法显示图片:\n{str(e)}")
    
    def display_cv_image(self, cv_image):
        """显示 OpenCV 图像"""
        
        try:
            # BGR 转 RGB
            rgb_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
            
            # 转换为 PIL Image
            pil_image = Image.fromarray(rgb_image)
            
            # 调整大小
            display_size = (700, 500)
            pil_image.thumbnail(display_size, Image.Resampling.LANCZOS)
            
            # 转换为 PhotoImage
            photo = ImageTk.PhotoImage(pil_image)
            
            # 更新显示
            self.image_label.config(image=photo, text="")
            self.image_label.image = photo
            
        except Exception as e:
            messagebox.showerror("错误", f"无法显示图像:\n{str(e)}")
    
    def save_result(self):
        """保存结果"""
        
        # 判断是单张图片还是批量结果
        if self.batch_results:
            # 批量保存
            self.save_batch_results()
        elif self.current_image is not None:
            # 单张图片保存
            self.save_single_result()
        else:
            messagebox.showwarning("警告", "没有可保存的结果")
    
    def save_single_result(self):
        """保存单张图片结果"""
        
        if self.current_image is None:
            messagebox.showerror("错误", "当前没有可保存的图像")
            return
        
        file_path = filedialog.asksaveasfilename(
            title="保存结果",
            defaultextension=".jpg",
            filetypes=[
                ("JPEG图片", "*.jpg"),
                ("PNG图片", "*.png"),
                ("所有文件", "*.*")
            ]
        )
        
        if file_path:
            try:
                # 检查图像是否有效
                if self.current_image is None or self.current_image.size == 0:
                    raise ValueError("图像数据无效")
                
                # 确保目录存在
                output_dir = os.path.dirname(file_path)
                if output_dir and not os.path.exists(output_dir):
                    os.makedirs(output_dir, exist_ok=True)
                
                # 使用 cv2.imencode 处理中文路径
                # cv2.imwrite 对中文路径支持不好，使用 imencode + tofile
                ext = os.path.splitext(file_path)[1].lower()
                if ext not in ['.jpg', '.jpeg', '.png', '.bmp']:
                    ext = '.jpg'  # 默认使用 jpg
                
                # 编码图像
                success, encoded_img = cv2.imencode(ext, self.current_image)
                
                if not success:
                    raise ValueError("图像编码失败")
                
                # 写入文件（支持中文路径）
                with open(file_path, 'wb') as f:
                    f.write(encoded_img.tobytes())
                
                # 验证文件是否真的被创建
                if not os.path.exists(file_path):
                    raise ValueError("文件未被创建")
                
                file_size = os.path.getsize(file_path)
                if file_size == 0:
                    raise ValueError("文件为空")
                
                self.log_result(f"\n图片保存成功:\n")
                self.log_result(f"  路径: {file_path}\n")
                self.log_result(f"  大小: {file_size / 1024:.2f} KB\n")
                
                messagebox.showinfo("成功", f"结果已保存到:\n{file_path}\n\n文件大小: {file_size / 1024:.2f} KB")
                self.update_status(f"结果已保存")
                
            except Exception as e:
                error_msg = f"保存失败:\n{str(e)}\n\n图像形状: {self.current_image.shape if self.current_image is not None else 'None'}"
                self.log_result(f"\n{error_msg}\n")
                messagebox.showerror("错误", error_msg)
    
    def save_batch_results(self):
        """批量保存结果"""
        
        if not self.batch_results:
            messagebox.showwarning("警告", "没有批量处理结果")
            return
        
        # 选择保存文件夹
        output_folder = filedialog.askdirectory(title="选择保存文件夹")
        
        if not output_folder:
            return
        
        try:
            saved_count = 0
            failed_count = 0
            total_size = 0
            
            self.update_status("正在保存批量结果...")
            self.log_result(f"\n开始保存 {len(self.batch_results)} 张图片...\n")
            
            for i, result in enumerate(self.batch_results, 1):
                filename = result['filename']
                image = result['image']
                
                # 构造输出路径
                output_path = os.path.join(output_folder, filename)
                
                try:
                    # 检查图像是否有效
                    if image is None or image.size == 0:
                        raise ValueError(f"图像数据无效: {filename}")
                    
                    # 使用 cv2.imencode 处理中文路径
                    ext = os.path.splitext(output_path)[1].lower()
                    if ext not in ['.jpg', '.jpeg', '.png', '.bmp']:
                        ext = '.jpg'
                    
                    # 编码图像
                    success, encoded_img = cv2.imencode(ext, image)
                    
                    if not success:
                        raise ValueError(f"图像编码失败")
                    
                    # 写入文件（支持中文路径）
                    with open(output_path, 'wb') as f:
                        f.write(encoded_img.tobytes())
                    
                    # 验证文件是否真的被创建
                    if not os.path.exists(output_path):
                        raise ValueError(f"文件未被创建")
                    
                    file_size = os.path.getsize(output_path)
                    if file_size == 0:
                        raise ValueError(f"文件为空")
                    
                    total_size += file_size
                    saved_count += 1
                    self.update_status(f"保存中... ({i}/{len(self.batch_results)})")
                    
                except Exception as e:
                    failed_count += 1
                    self.log_result(f"  保存失败: {filename} - {str(e)}\n")
            
            # 显示保存结果
            self.log_result(f"\n批量保存完成!\n")
            self.log_result(f"  成功: {saved_count} 张\n")
            if failed_count > 0:
                self.log_result(f"  失败: {failed_count} 张\n")
            self.log_result(f"  总大小: {total_size / (1024*1024):.2f} MB\n")
            self.log_result(f"  保存位置: {output_folder}\n")
            
            messagebox.showinfo(
                "保存完成", 
                f"批量保存完成!\n\n成功: {saved_count} 张\n失败: {failed_count} 张\n总大小: {total_size / (1024*1024):.2f} MB\n\n保存位置:\n{output_folder}"
            )
            self.update_status(f"批量保存完成! 成功 {saved_count} 张")
            
        except Exception as e:
            error_msg = f"批量保存失败:\n{str(e)}"
            self.log_result(f"\n{error_msg}\n")
            messagebox.showerror("错误", error_msg)
    
    def clear_all(self):
        """清空所有内容"""
        
        self.current_image = None
        self.current_image_path = None
        self.batch_results = []  # 清空批量结果
        self.current_batch_index = 0
        
        # 如果在总览模式，退出总览
        if self.is_overview_mode:
            self.hide_overview()
        
        self.image_label.config(
            image="",
            text="请选择图片或视频\n支持格式: JPG, PNG, MP4"
        )
        
        self.result_text.delete(1.0, tk.END)
        self.btn_recognize.config(state=tk.DISABLED)
        self.btn_save.config(state=tk.DISABLED)
        
        # 禁用导航按钮
        self.btn_prev.config(state=tk.DISABLED)
        self.btn_next.config(state=tk.DISABLED)
        self.btn_overview.config(state=tk.DISABLED)
        self.image_info_label.config(text="")
        
        self.update_status("已清空")
    
    def log_result(self, text):
        """记录结果到文本框"""
        
        self.result_text.insert(tk.END, text)
        self.result_text.see(tk.END)
        self.root.update()
    
    def update_status(self, text):
        """更新状态栏"""
        
        self.status_label.config(text=text)
        self.root.update()
    
    def display_batch_image(self, index):
        """显示批量结果中的指定图片"""
        
        if not self.batch_results or index < 0 or index >= len(self.batch_results):
            return
        
        result = self.batch_results[index]
        image = result['image']
        filename = result['filename']
        plates = result['plates']
        
        # 显示图片
        self.display_cv_image(image)
        
        # 更新信息标签
        self.image_info_label.config(
            text=f"第 {index + 1}/{len(self.batch_results)} 张 - {filename} - {len(plates)} 个车牌"
        )
        
        self.current_batch_index = index
        self.update_navigation_buttons()
    
    def show_previous_image(self):
        """显示上一张图片"""
        
        if self.current_batch_index > 0:
            self.display_batch_image(self.current_batch_index - 1)
    
    def show_next_image(self):
        """显示下一张图片"""
        
        if self.current_batch_index < len(self.batch_results) - 1:
            self.display_batch_image(self.current_batch_index + 1)
    
    def update_navigation_buttons(self):
        """更新导航按钮状态"""
        
        if not self.batch_results or len(self.batch_results) < 2:
            # 少于2张图片，禁用所有导航按钮
            self.btn_prev.config(state=tk.DISABLED)
            self.btn_next.config(state=tk.DISABLED)
            self.btn_overview.config(state=tk.DISABLED)
            return
        
        # 启用总览按钮
        self.btn_overview.config(state=tk.NORMAL)
        
        # 更新上一张按钮
        if self.current_batch_index > 0:
            self.btn_prev.config(state=tk.NORMAL)
        else:
            self.btn_prev.config(state=tk.DISABLED)
        
        # 更新下一张按钮
        if self.current_batch_index < len(self.batch_results) - 1:
            self.btn_next.config(state=tk.NORMAL)
        else:
            self.btn_next.config(state=tk.DISABLED)
    
    def show_overview(self):
        """切换总览模式/单图模式"""
        
        if not self.batch_results:
            return
        
        # 切换模式
        if self.is_overview_mode:
            # 从总览模式切换回单图模式
            self.hide_overview()
        else:
            # 从单图模式切换到总览模式
            self.display_overview()
    
    def display_overview(self):
        """在图像显示区域显示总览"""
        
        if not self.batch_results:
            return
        
        # 隐藏单图显示
        self.image_label.pack_forget()
        
        # 创建总览框架（如果不存在）
        if self.overview_frame:
            self.overview_frame.destroy()
        
        self.overview_frame = tk.Frame(self.display_container, bg="white")
        self.overview_frame.pack(fill=tk.BOTH, expand=True)
        
        # 创建滚动区域
        canvas = tk.Canvas(self.overview_frame, bg="white", highlightthickness=0)
        scrollbar = tk.Scrollbar(self.overview_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = tk.Frame(canvas, bg="white")
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # 绑定鼠标滚轮事件
        def on_mousewheel(event):
            canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
        
        # 为 canvas 和 scrollable_frame 绑定滚轮事件
        canvas.bind_all("<MouseWheel>", on_mousewheel)
        
        # 当鼠标离开总览区域时解除绑定（避免影响其他区域）
        def on_leave(event):
            canvas.unbind_all("<MouseWheel>")
        
        def on_enter(event):
            canvas.bind_all("<MouseWheel>", on_mousewheel)
        
        canvas.bind("<Enter>", on_enter)
        canvas.bind("<Leave>", on_leave)
        
        # 计算每行显示的列数（根据窗口宽度自适应）
        # 获取显示容器的宽度
        self.overview_frame.update_idletasks()
        container_width = self.display_container.winfo_width()
        
        # 每个缩略图的宽度（包括边距和边框）
        # 缩略图尺寸 + 内边距 + 外边距 + 边框
        thumb_size = 220  # 缩略图最大尺寸
        item_width = thumb_size + 10 + 16 + 4  # 内边距(10) + 外边距(16) + 边框(4)
        
        # 计算可以容纳的列数，至少1列，最多6列
        cols = max(1, min(6, (container_width - 20) // item_width))  # 20为滚动条宽度
        
        # 显示每张图片的缩略图
        for i, result in enumerate(self.batch_results):
            row = i // cols
            col = i % cols
            
            # 创建框架
            item_frame = tk.Frame(scrollable_frame, bg="white", relief=tk.RAISED, borderwidth=2)
            item_frame.grid(row=row, column=col, padx=8, pady=8, sticky="nsew")
            
            # 缩略图
            try:
                image = result['image']
                filename = result['filename']
                plates = result['plates']
                
                # 调整为缩略图大小
                h, w = image.shape[:2]
                max_size = thumb_size
                if w > h:
                    new_w = max_size
                    new_h = int(h * max_size / w)
                else:
                    new_h = max_size
                    new_w = int(w * max_size / h)
                
                thumb = cv2.resize(image, (new_w, new_h))
                rgb_thumb = cv2.cvtColor(thumb, cv2.COLOR_BGR2RGB)
                pil_thumb = Image.fromarray(rgb_thumb)
                photo_thumb = ImageTk.PhotoImage(pil_thumb)
                
                # 图片标签（可点击）
                img_label = tk.Label(item_frame, image=photo_thumb, cursor="hand2", bg="white")
                img_label.image = photo_thumb  # 保持引用
                img_label.pack(padx=5, pady=5)
                
                # 点击跳转到该图片
                def make_click_handler(index):
                    return lambda e: self.jump_to_image_inline(index)
                
                img_label.bind("<Button-1>", make_click_handler(i))
                
                # 信息标签
                info_text = f"{i + 1}. {filename}\n{len(plates)} 个车牌"
                info_label = tk.Label(
                    item_frame,
                    text=info_text,
                    font=("微软雅黑", 9),
                    bg="white",
                    justify=tk.CENTER
                )
                info_label.pack(padx=5, pady=2)
                
            except Exception as e:
                error_label = tk.Label(
                    item_frame,
                    text=f"加载失败:\n{str(e)}",
                    font=("微软雅黑", 9),
                    bg="white",
                    fg="red"
                )
                error_label.pack(padx=5, pady=5)
        
        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # 绑定窗口大小改变事件，自动刷新布局
        def on_resize(event):
            # 使用 after 延迟执行，避免频繁刷新
            if hasattr(self, '_resize_timer'):
                self.root.after_cancel(self._resize_timer)
            self._resize_timer = self.root.after(300, self.refresh_overview)
        
        self.display_container.bind("<Configure>", on_resize)
        
        # 更新状态
        self.is_overview_mode = True
        self.btn_overview.config(text="🔙 返回")
        self.image_info_label.config(text=f"总览模式 - 共 {len(self.batch_results)} 张图片")
    
    def hide_overview(self):
        """隐藏总览，返回单图模式"""
        
        # 解绑窗口大小改变事件
        self.display_container.unbind("<Configure>")
        
        # 取消待处理的刷新定时器
        if hasattr(self, '_resize_timer'):
            self.root.after_cancel(self._resize_timer)
            delattr(self, '_resize_timer')
        
        # 销毁总览框架
        if self.overview_frame:
            self.overview_frame.destroy()
            self.overview_frame = None
        
        # 显示单图
        self.image_label.pack(fill=tk.BOTH, expand=True)
        
        # 恢复显示当前图片
        if self.batch_results and 0 <= self.current_batch_index < len(self.batch_results):
            self.display_batch_image(self.current_batch_index)
        
        # 更新状态
        self.is_overview_mode = False
        self.btn_overview.config(text="📋 总览")
    
    def refresh_overview(self):
        """刷新总览布局（窗口大小改变时）"""
        
        if self.is_overview_mode and self.batch_results:
            # 重新显示总览
            self.display_overview()
    
    def jump_to_image(self, index, overview_window):
        """从总览窗口跳转到指定图片（旧版本，保留兼容）"""
        
        self.display_batch_image(index)
        overview_window.destroy()
    
    def jump_to_image_inline(self, index):
        """从内联总览跳转到指定图片"""
        
        # 隐藏总览
        self.hide_overview()
        
        # 显示指定图片
        self.display_batch_image(index)


def main():
    """主函数"""
    
    root = tk.Tk()
    app = PlateRecognitionGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
