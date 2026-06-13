package com.tsj.Controller;

import com.tsj.project.Appeal;
import com.tsj.Service.AppealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/appeal")
public class AppealController {
    
    @Autowired
    private AppealService appealService;
    
    // 创建申诉
    @PostMapping("/createAppeal")
    public ResponseEntity<Map<String, Object>> createAppeal(@RequestBody Appeal appeal) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 检查是否已存在申诉
            Appeal existingAppeal = appealService.getAppealByStudentAndCourse(appeal.getStudentId(), appeal.getCourseId());
            if (existingAppeal != null) {
                response.put("success", false);
                response.put("message", "该课程已存在申诉记录，请修改现有申诉");
                return ResponseEntity.ok(response);
            }
            
            appealService.createAppeal(appeal);
            response.put("success", true);
            response.put("message", "申诉提交成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "申诉提交失败：" + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    // 根据学生ID获取申诉列表
    @GetMapping("/getAppealsByStudentId/{studentId}")
    public ResponseEntity<Map<String, Object>> getAppealsByStudentId(@PathVariable Long studentId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Appeal> appeals = appealService.getAppealsByStudentId(studentId);
            response.put("success", true);
            response.put("data", appeals);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取申诉列表失败：" + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    // 根据课程ID获取申诉列表（教师查看）
    @GetMapping("/getAppealsByCourseId/{courseId}")
    public ResponseEntity<Map<String, Object>> getAppealsByCourseId(@PathVariable Long courseId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Appeal> appeals = appealService.getAppealsByCourseId(courseId);
            response.put("success", true);
            response.put("data", appeals);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取申诉列表失败：" + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    // 获取所有申诉列表（管理员查看）
    @GetMapping("/getAllAppeals")
    public ResponseEntity<Map<String, Object>> getAllAppeals() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Appeal> appeals = appealService.getAllAppeals();
            response.put("success", true);
            response.put("data", appeals);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取申诉列表失败：" + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    // 更新申诉
    @PutMapping("/updateAppeal")
    public ResponseEntity<Map<String, Object>> updateAppeal(@RequestBody Appeal appeal) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            appealService.updateAppeal(appeal);
            response.put("success", true);
            response.put("message", "申诉修改成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "申诉修改失败：" + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    // 删除申诉
    @DeleteMapping("/deleteAppeal/{studentId}/{courseId}")
    public ResponseEntity<Map<String, Object>> deleteAppeal(@PathVariable Long studentId, @PathVariable Long courseId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            appealService.deleteAppeal(studentId, courseId);
            response.put("success", true);
            response.put("message", "申诉撤销成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "申诉撤销失败：" + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    // 教师处理申诉（同意/驳回）
    @PostMapping("/handleAppeal")
    public ResponseEntity<Map<String, Object>> handleAppeal(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long studentId = Long.valueOf(request.get("studentId").toString());
            Long courseId = Long.valueOf(request.get("courseId").toString());
            String status = request.get("status").toString(); // "approved" 或 "rejected"
            String teacherResponse = request.get("teacherResponse").toString();
            String responseTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            
            appealService.handleAppeal(studentId, courseId, status, teacherResponse, responseTime);
            
            String statusText = "approved".equals(status) ? "同意" : "驳回";
            response.put("success", true);
            response.put("message", "申诉已" + statusText);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "处理申诉失败：" + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
