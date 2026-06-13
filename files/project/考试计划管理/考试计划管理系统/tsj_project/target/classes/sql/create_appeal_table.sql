-- 创建申诉表
CREATE TABLE IF NOT EXISTS appeal (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL COMMENT '学生ID',
    course_id BIGINT NOT NULL COMMENT '课程ID',
    course_name VARCHAR(255) NOT NULL COMMENT '课程名称',
    reason TEXT NOT NULL COMMENT '申诉理由',
    appeal_time VARCHAR(50) NOT NULL COMMENT '申诉时间',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '申诉状态：pending-待处理，approved-同意，rejected-驳回',
    teacher_response TEXT COMMENT '教师回复',
    response_time VARCHAR(50) COMMENT '回复时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY unique_student_course (student_id, course_id) COMMENT '同一学生同一课程只能有一个申诉',
    INDEX idx_student_id (student_id),
    INDEX idx_course_id (course_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成绩申诉表';
