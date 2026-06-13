package com.tsj.Service;

import com.tsj.Mapper.AppealMapper;
import com.tsj.project.Appeal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppealService {
    
    @Autowired
    private AppealMapper appealMapper;
    
    // 创建申诉
    public void createAppeal(Appeal appeal) {
        appealMapper.insertAppeal(appeal);
    }
    
    // 根据学生ID获取申诉列表
    public List<Appeal> getAppealsByStudentId(Long studentId) {
        return appealMapper.getAppealsByStudentId(studentId);
    }
    
    // 根据课程ID获取申诉列表（教师查看）
    public List<Appeal> getAppealsByCourseId(Long courseId) {
        return appealMapper.getAppealsByCourseId(courseId);
    }
    
    // 获取所有申诉列表（管理员查看）
    public List<Appeal> getAllAppeals() {
        return appealMapper.getAllAppeals();
    }
    
    // 根据学生ID和课程ID获取申诉
    public Appeal getAppealByStudentAndCourse(Long studentId, Long courseId) {
        return appealMapper.getAppealByStudentAndCourse(studentId, courseId);
    }
    
    // 更新申诉
    public void updateAppeal(Appeal appeal) {
        appealMapper.updateAppeal(appeal);
    }
    
    // 删除申诉
    public void deleteAppeal(Long studentId, Long courseId) {
        appealMapper.deleteAppeal(studentId, courseId);
    }
    
    // 教师处理申诉（同意/驳回）
    public void handleAppeal(Long studentId, Long courseId, String status, String teacherResponse, String responseTime) {
        appealMapper.handleAppeal(studentId, courseId, status, teacherResponse, responseTime);
    }
}
