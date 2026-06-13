# -*- coding: UTF-8 -*-
"""
图像增强模块 - 处理极端情况下的车牌图像
包括：光照增强、去噪、对比度调整、透视矫正等
"""

import cv2
import numpy as np
from typing import List, Tuple, Optional


class ImageEnhancement:
    """图像增强类，用于处理极端情况下的车牌图像"""
    
    @staticmethod
    def enhance_illumination(img: np.ndarray) -> np.ndarray:
        """
        增强光照不足的图像
        使用CLAHE (Contrast Limited Adaptive Histogram Equalization)
        """
        if len(img.shape) == 2:
            # 灰度图
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            enhanced = clahe.apply(img)
            return enhanced
        else:
            # 彩色图
            lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
            l, a, b = cv2.split(lab)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            l = clahe.apply(l)
            enhanced = cv2.merge([l, a, b])
            enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
            return enhanced
    
    @staticmethod
    def enhance_brightness(img: np.ndarray, alpha: float = 1.2, beta: int = 30) -> np.ndarray:
        """
        增强图像亮度
        alpha: 对比度控制 (1.0-3.0)
        beta: 亮度控制 (0-100)
        """
        enhanced = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)
        return enhanced
    
    @staticmethod
    def reduce_noise(img: np.ndarray, method: str = 'bilateral') -> np.ndarray:
        """
        降噪处理
        method: 'bilateral', 'gaussian', 'median', 'nlm'
        """
        if method == 'bilateral':
            # 双边滤波，保留边缘
            denoised = cv2.bilateralFilter(img, 5, 50, 50)
        elif method == 'gaussian':
            denoised = cv2.GaussianBlur(img, (5, 5), 0)
        elif method == 'median':
            denoised = cv2.medianBlur(img, 5)
        elif method == 'nlm':
            # 非局部均值降噪（仅支持灰度图）
            if len(img.shape) == 2:
                denoised = cv2.fastNlMeansDenoising(img, None, 10, 7, 21)
            else:
                denoised = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)
        else:
            denoised = img
        return denoised
    
    @staticmethod
    def enhance_contrast(img: np.ndarray, alpha: float = 1.5) -> np.ndarray:
        """
        增强对比度
        alpha: 对比度控制 (1.0-3.0)
        """
        enhanced = cv2.convertScaleAbs(img, alpha=alpha, beta=0)
        return enhanced
    
    @staticmethod
    def sharpen(img: np.ndarray) -> np.ndarray:
        """
        图像锐化
        """
        kernel = np.array([[-1, -1, -1],
                          [-1,  9, -1],
                          [-1, -1, -1]])
        sharpened = cv2.filter2D(img, -1, kernel)
        return sharpened
    
    @staticmethod
    def correct_perspective(img: np.ndarray, pts: Optional[np.ndarray] = None) -> np.ndarray:
        """
        透视矫正
        pts: 四个角点坐标，如果为None则尝试自动检测
        """
        if pts is not None and len(pts) == 4:
            # 使用给定的角点进行透视变换
            height, width = img.shape[:2]
            dst = np.array([[0, 0], [width, 0], [width, height], [0, height]], dtype='float32')
            M = cv2.getPerspectiveTransform(pts.astype('float32'), dst)
            corrected = cv2.warpPerspective(img, M, (width, height))
            return corrected
        else:
            # 自动检测边缘并矫正（简单实现）
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img
            edges = cv2.Canny(gray, 50, 150)
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if contours:
                # 找到最大的轮廓
                largest_contour = max(contours, key=cv2.contourArea)
                # 计算轮廓的凸包
                hull = cv2.convexHull(largest_contour)
                # 近似为四边形
                epsilon = 0.02 * cv2.arcLength(hull, True)
                approx = cv2.approxPolyDP(hull, epsilon, True)
                
                if len(approx) == 4:
                    # 找到了四边形，进行透视矫正
                    pts = approx.reshape(4, 2)
                    height, width = img.shape[:2]
                    dst = np.array([[0, 0], [width, 0], [width, height], [0, height]], dtype='float32')
                    M = cv2.getPerspectiveTransform(pts.astype('float32'), dst)
                    corrected = cv2.warpPerspective(img, M, (width, height))
                    return corrected
        
        return img
    
    @staticmethod
    def auto_enhance(img: np.ndarray, enhance_level: str = 'medium') -> List[np.ndarray]:
        """
        自动增强图像，返回多个增强版本的图像
        enhance_level: 'light', 'medium', 'aggressive'
        """
        enhanced_imgs = [img]  # 保留原始图像
        
        # 检测图像质量
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img
        brightness = np.mean(gray)
        contrast = np.std(gray)
        
        # 根据图像质量选择增强策略
        if enhance_level == 'light':
            # 轻度增强
            enhanced_imgs.append(ImageEnhancement.enhance_illumination(img))
            enhanced_imgs.append(ImageEnhancement.reduce_noise(img, 'bilateral'))
        elif enhance_level == 'medium':
            # 中度增强
            enhanced_imgs.append(ImageEnhancement.enhance_illumination(img))
            enhanced_imgs.append(ImageEnhancement.reduce_noise(img, 'bilateral'))
            enhanced_imgs.append(ImageEnhancement.enhance_contrast(img, 1.3))
            # 组合增强
            enhanced = ImageEnhancement.enhance_illumination(img)
            enhanced = ImageEnhancement.reduce_noise(enhanced, 'bilateral')
            enhanced_imgs.append(enhanced)
        else:  # aggressive
            # 激进增强 - 尝试多种组合
            enhanced_imgs.append(ImageEnhancement.enhance_illumination(img))
            enhanced_imgs.append(ImageEnhancement.reduce_noise(img, 'bilateral'))
            enhanced_imgs.append(ImageEnhancement.enhance_contrast(img, 1.5))
            enhanced_imgs.append(ImageEnhancement.enhance_brightness(img, 1.2, 20))
            enhanced_imgs.append(ImageEnhancement.sharpen(img))
            
            # 组合增强1: 光照+降噪
            enhanced1 = ImageEnhancement.enhance_illumination(img)
            enhanced1 = ImageEnhancement.reduce_noise(enhanced1, 'bilateral')
            enhanced_imgs.append(enhanced1)
            
            # 组合增强2: 光照+对比度
            enhanced2 = ImageEnhancement.enhance_illumination(img)
            enhanced2 = ImageEnhancement.enhance_contrast(enhanced2, 1.4)
            enhanced_imgs.append(enhanced2)
            
            # 组合增强3: 降噪+对比度+锐化
            enhanced3 = ImageEnhancement.reduce_noise(img, 'bilateral')
            enhanced3 = ImageEnhancement.enhance_contrast(enhanced3, 1.3)
            enhanced3 = ImageEnhancement.sharpen(enhanced3)
            enhanced_imgs.append(enhanced3)
            
            # 组合增强4: 全流程增强
            enhanced4 = ImageEnhancement.enhance_illumination(img)
            enhanced4 = ImageEnhancement.reduce_noise(enhanced4, 'bilateral')
            enhanced4 = ImageEnhancement.enhance_contrast(enhanced4, 1.3)
            enhanced4 = ImageEnhancement.sharpen(enhanced4)
            enhanced_imgs.append(enhanced4)
        
        # 去重（基于图像相似度）
        unique_imgs = []
        for enhanced_img in enhanced_imgs:
            is_unique = True
            for unique_img in unique_imgs:
                # 简单的相似度检测
                if np.array_equal(enhanced_img, unique_img):
                    is_unique = False
                    break
            if is_unique:
                unique_imgs.append(enhanced_img)
        
        return unique_imgs
    
    @staticmethod
    def detect_image_quality(img: np.ndarray) -> dict:
        """
        检测图像质量
        返回：亮度、对比度、模糊度等信息
        """
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img
        
        # 亮度
        brightness = np.mean(gray)
        
        # 对比度（标准差）
        contrast = np.std(gray)
        
        # 模糊度（Laplacian方差）
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        # 判断是否需要增强
        needs_enhancement = {
            'low_brightness': brightness < 80,
            'low_contrast': contrast < 30,
            'blurry': laplacian_var < 100,
        }
        
        return {
            'brightness': brightness,
            'contrast': contrast,
            'blurriness': laplacian_var,
            'needs_enhancement': needs_enhancement,
            'quality_score': (brightness / 255.0 * 0.3 + 
                            min(contrast / 100.0, 1.0) * 0.4 + 
                            min(laplacian_var / 500.0, 1.0) * 0.3)
        }

