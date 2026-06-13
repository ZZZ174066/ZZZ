package com.tsj.algorithm;

import java.util.Map;


public interface PackingStepListener {
    void onEvent(Map<String, Object> event);
}
