CREATE TABLE IF NOT EXISTS item (
    item_id           BIGINT       NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '物品ID',
    item_name         VARCHAR(100) NOT NULL COMMENT '物品名称',
    length_mm         INT          NOT NULL COMMENT '物品长(mm)',
    width_mm          INT          NOT NULL COMMENT '物品宽(mm)',
    height_mm         INT          NOT NULL COMMENT '物品高(mm)',
    quantity          INT          NOT NULL DEFAULT 0 COMMENT '物品数量(个)',
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_item_name (item_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物品表';

CREATE TABLE IF NOT EXISTS container (
    container_id      BIGINT       NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '容器ID',
    container_name    VARCHAR(100) NOT NULL COMMENT '容器名称',
    length_mm         INT          NOT NULL COMMENT '容器长(mm)',
    width_mm          INT          NOT NULL COMMENT '容器宽(mm)',
    height_mm         INT          NOT NULL COMMENT '容器高(mm)',
    quantity          INT          NOT NULL DEFAULT 0 COMMENT '容器数量(个)',
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_container_name (container_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='容器表';

CREATE TABLE IF NOT EXISTS plan (
    plan_id                            BIGINT        NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '方案ID',
    plan_name                          VARCHAR(100)  NOT NULL COMMENT '方案名称',

    planned_total_item_qty             INT           NOT NULL DEFAULT 0 COMMENT '方案计划用到的总物品数量',
    actual_total_item_qty              INT           NOT NULL DEFAULT 0 COMMENT '方案实际用到的总物品数量',
    avg_item_support_rate              DECIMAL(5,2)  NOT NULL DEFAULT 0 COMMENT '方案实际用到物品的平均支撑率(0-100)',

    planned_total_container_qty        INT           NOT NULL DEFAULT 0 COMMENT '方案计划用到的总容器数量',
    actual_total_container_qty         INT           NOT NULL DEFAULT 0 COMMENT '方案实际用到的总容器数量',
    avg_filled_container_fill_rate     DECIMAL(5,2)  NOT NULL DEFAULT 0 COMMENT '方案实际用到且装满容器的平均填充率(0-100)',

    plan_status                        TINYINT       NOT NULL DEFAULT 0 COMMENT '方案状态：0-未开始,1-容器不足,2-物品不足',
    need_update                        TINYINT       NOT NULL DEFAULT 0 COMMENT '方案是否需要更新：0-否,1-是',

    created_at                         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '方案创建时间',
    updated_at                         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '方案更新时间',
    INDEX idx_plan_name (plan_name),
    INDEX idx_plan_status (plan_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='装载方案表';

CREATE TABLE IF NOT EXISTS plan_item (
    id              BIGINT     NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    plan_id         BIGINT     NOT NULL COMMENT '关联的方案ID',
    item_id         BIGINT     NOT NULL COMMENT '关联的物品ID',
    item_qty        INT        NOT NULL DEFAULT 0 COMMENT '对应的物品数量',
    INDEX idx_plan_item_plan_id (plan_id),
    UNIQUE KEY uk_plan_item (plan_id, item_id),
    CONSTRAINT fk_plan_item_plan
        FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_item_item
        FOREIGN KEY (item_id) REFERENCES item (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='方案计划物品表';

CREATE TABLE IF NOT EXISTS plan_container (
    id              BIGINT     NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    plan_id         BIGINT     NOT NULL COMMENT '关联的方案ID',
    container_id    BIGINT     NOT NULL COMMENT '关联的容器ID',
    container_qty   INT        NOT NULL DEFAULT 0 COMMENT '对应的容器数量',
    INDEX idx_plan_container_plan_id (plan_id),
    UNIQUE KEY uk_plan_container (plan_id, container_id),
    CONSTRAINT fk_plan_container_plan
        FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_container_container
        FOREIGN KEY (container_id) REFERENCES container (container_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='方案计划容器表';

CREATE TABLE IF NOT EXISTS plan_item_detail (
    id                      BIGINT        NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    plan_id                 BIGINT        NOT NULL COMMENT '关联的方案ID',
    item_id                 BIGINT        NOT NULL COMMENT '关联的物品ID',

    loaded                  TINYINT       NOT NULL DEFAULT 0 COMMENT '物品是否被装载：0-否,1-是',
    container_instance_id   BIGINT        NULL COMMENT '物品所在的容器对应的ID',
    layer_index             INT           NULL COMMENT '物品所在层数（从1开始）',
    pos_x                   DECIMAL(10,2) NULL COMMENT '物品位置X坐标',
    pos_y                   DECIMAL(10,2) NULL COMMENT '物品位置Y坐标',
    pos_z                   DECIMAL(10,2) NULL COMMENT '物品位置Z坐标',
    swap_length_width       TINYINT       NOT NULL DEFAULT 0 COMMENT '物品是否交换长宽：0-否,1-是',
    support_rate            DECIMAL(5,2)  NOT NULL DEFAULT 0 COMMENT '物品支撑率(0-100)',

    INDEX idx_plan_item_detail_plan_id (plan_id),
    INDEX idx_plan_item_detail_loaded (loaded),
    CONSTRAINT fk_plan_item_detail_plan
        FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_item_detail_item
        FOREIGN KEY (item_id) REFERENCES item (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='方案单个物品细节表';

CREATE TABLE IF NOT EXISTS plan_container_detail (
    id                      BIGINT        NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID(容器实例ID)',
    plan_id                 BIGINT        NOT NULL COMMENT '关联的方案ID',
    container_id            BIGINT        NOT NULL COMMENT '关联的容器ID',

    filled                  TINYINT       NOT NULL DEFAULT 0 COMMENT '容器是否装满：0-否,1-是（容器没装东西时也视为否）',
    filled_item_qty         INT           NOT NULL DEFAULT 0 COMMENT '容器的填充物品数量',
    fill_rate               DECIMAL(5,2)  NOT NULL DEFAULT 0 COMMENT '容器填充率(0-100)',
    avg_support_rate        DECIMAL(5,2)  NOT NULL DEFAULT 0 COMMENT '容器中的平均支撑率(0-100)',

    INDEX idx_plan_container_detail_plan_id (plan_id),
    INDEX idx_plan_container_detail_filled (filled),
    CONSTRAINT fk_plan_container_detail_plan
        FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_container_detail_container
        FOREIGN KEY (container_id) REFERENCES container (container_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='方案单个容器细节表';

CREATE TABLE IF NOT EXISTS plan_requirement (
    id              BIGINT        NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    plan_id         BIGINT        NOT NULL COMMENT '关联的方案ID',

    finished        TINYINT       NOT NULL DEFAULT 0 COMMENT '需求是否完成：0-否,1-是',
    content         TEXT          NOT NULL COMMENT '需求的具体内容（供LLM读取）',
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '需求创建时间',
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '需求更新时间',

    INDEX idx_plan_requirement_plan_id (plan_id),
    CONSTRAINT fk_plan_requirement_plan
        FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='方案特殊需求表';
