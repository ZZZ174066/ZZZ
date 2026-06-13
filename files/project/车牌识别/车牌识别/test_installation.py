# -*- coding: UTF-8 -*-
"""
车牌识别系统安装验证脚本
运行此脚本检查所有依赖是否正确安装
"""

import sys

def check_module(module_name, import_name=None):
    """检查模块是否已安装"""
    if import_name is None:
        import_name = module_name
    
    try:
        module = __import__(import_name)
        version = getattr(module, '__version__', '未知版本')
        print(f"✓ {module_name:20s} - 已安装 (版本: {version})")
        return True
    except ImportError:
        print(f"✗ {module_name:20s} - 未安装")
        return False

def main():
    print("=" * 60)
    print("车牌识别系统 - 依赖检查")
    print("=" * 60)
    print()
    
    # 检查 Python 版本
    python_version = sys.version_info
    print(f"Python 版本: {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 6):
        print("⚠ 警告: Python 版本过低，建议使用 Python 3.6 或更高版本")
    else:
        print("✓ Python 版本符合要求")
    
    print()
    print("-" * 60)
    print("检查核心依赖:")
    print("-" * 60)
    
    # 核心依赖
    core_modules = [
        ('torch', 'torch'),
        ('torchvision', 'torchvision'),
        ('opencv-python', 'cv2'),
        ('numpy', 'numpy'),
        ('Pillow', 'PIL'),
    ]
    
    all_core_installed = True
    for module_name, import_name in core_modules:
        if not check_module(module_name, import_name):
            all_core_installed = False
    
    print()
    print("-" * 60)
    print("检查辅助依赖:")
    print("-" * 60)
    
    # 辅助依赖
    aux_modules = [
        ('PyYAML', 'yaml'),
        ('tqdm', 'tqdm'),
        ('matplotlib', 'matplotlib'),
        ('scipy', 'scipy'),
        ('requests', 'requests'),
    ]
    
    for module_name, import_name in aux_modules:
        check_module(module_name, import_name)
    
    print()
    print("-" * 60)
    print("检查 CUDA 支持:")
    print("-" * 60)
    
    try:
        import torch
        if torch.cuda.is_available():
            print(f"✓ CUDA 可用")
            print(f"  CUDA 版本: {torch.version.cuda}")
            print(f"  GPU 数量: {torch.cuda.device_count()}")
            for i in range(torch.cuda.device_count()):
                print(f"  GPU {i}: {torch.cuda.get_device_name(i)}")
        else:
            print("⚠ CUDA 不可用 (将使用 CPU 运行，速度较慢)")
    except:
        print("✗ 无法检查 CUDA 状态")
    
    print()
    print("=" * 60)
    
    if all_core_installed:
        print("✓ 所有核心依赖已正确安装！")
        print()
        print("您现在可以运行以下命令测试车牌识别：")
        print("  python detect_plate.py --image_path imgs --output result")
    else:
        print("✗ 缺少核心依赖，请先安装：")
        print()
        print("方法1 - 使用安装脚本（推荐）：")
        print("  双击运行 install_dependencies.bat")
        print()
        print("方法2 - 手动安装：")
        print("  pip install torch torchvision opencv-python numpy pillow")
        print()
        print("详细安装说明请查看：安装指南.md")
    
    print("=" * 60)

if __name__ == '__main__':
    main()

