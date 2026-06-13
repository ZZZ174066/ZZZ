package com.tsj.project;

public class Appeal {
    private Long id;
    private Long studentId;
    private Long courseId;
    private String courseName;
    private String reason;
    private String appealTime;
    private String status; // pending, approved, rejected
    private String teacherResponse;
    private String responseTime;

    // 构造函数
    public Appeal() {}

    public Appeal(Long studentId, Long courseId, String courseName, String reason, String appealTime, String status) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.courseName = courseName;
        this.reason = reason;
        this.appealTime = appealTime;
        this.status = status;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getAppealTime() {
        return appealTime;
    }

    public void setAppealTime(String appealTime) {
        this.appealTime = appealTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTeacherResponse() {
        return teacherResponse;
    }

    public void setTeacherResponse(String teacherResponse) {
        this.teacherResponse = teacherResponse;
    }

    public String getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(String responseTime) {
        this.responseTime = responseTime;
    }

    @Override
    public String toString() {
        return "Appeal{" +
                "id=" + id +
                ", studentId=" + studentId +
                ", courseId=" + courseId +
                ", courseName='" + courseName + '\'' +
                ", reason='" + reason + '\'' +
                ", appealTime='" + appealTime + '\'' +
                ", status='" + status + '\'' +
                ", teacherResponse='" + teacherResponse + '\'' +
                ", responseTime='" + responseTime + '\'' +
                '}';
    }
}
