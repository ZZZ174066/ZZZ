package com.tsj.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.tsj.project.Appeal;
import java.util.List;

@Mapper
public interface AppealMapper {
    
    // 创建申诉
    void insertAppeal(Appeal appeal);
    
    // 根据学生ID获取申诉列表
    List<Appeal> getAppealsByStudentId(Long studentId);
    
    // 根据课程ID获取申诉列表（教师查看）
    List<Appeal> getAppealsByCourseId(Long courseId);
    
    // 获取所有申诉列表（管理员查看）
    List<Appeal> getAllAppeals();
    
    // 根据学生ID和课程ID获取申诉
    Appeal getAppealByStudentAndCourse(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
    
    // 更新申诉
    void updateAppeal(Appeal appeal);
    
    // 删除申诉
    void deleteAppeal(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
    
    // 教师处理申诉（同意/驳回）
    void handleAppeal(@Param("studentId") Long studentId, @Param("courseId") Long courseId, 
                     @Param("status") String status, @Param("teacherResponse") String teacherResponse, 
                     @Param("responseTime") String responseTime);
}
