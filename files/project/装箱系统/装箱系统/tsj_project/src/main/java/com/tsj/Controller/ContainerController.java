package com.tsj.Controller;

import com.tsj.entity.Container;
import com.tsj.mapper.ContainerMapper;
import com.tsj.mapper.PlanContainerMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/containers")
public class ContainerController {
    private static final String IMPORTED_CONTAINER_PREFIX = "__IMPORTED_CONTAINER__";

    private final ContainerMapper containerMapper;
    private final PlanContainerMapper planContainerMapper;

    public ContainerController(ContainerMapper containerMapper, PlanContainerMapper planContainerMapper) {
        this.containerMapper = containerMapper;
        this.planContainerMapper = planContainerMapper;
    }

    @GetMapping
    public List<Container> list(@RequestParam(value = "keyword", required = false) String keyword) {
        List<Container> all = containerMapper.selectAll();
        if (all == null) return List.of();
        return all.stream()
                .filter(c -> c != null && c.getContainerName() != null)
                .peek(c -> {
                    boolean imported = c.getContainerName().startsWith(IMPORTED_CONTAINER_PREFIX);
                    c.setOrderImported(imported);
                    c.setContainerName(stripImportedPrefix(c.getContainerName()));
                })
                .filter(c -> keyword == null || keyword.isBlank() || c.getContainerName().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Container getById(@PathVariable Long id) {
        return containerMapper.selectById(id);
    }

    @PostMapping
    public Container create(@RequestBody Container container) {
        containerMapper.insert(container);
        return containerMapper.selectById(container.getContainerId());
    }

    @PutMapping("/{id}")
    public Container update(@PathVariable Long id, @RequestBody Container container) {
        container.setContainerId(id);
        containerMapper.update(container);
        return containerMapper.selectById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (planContainerMapper.countByContainerId(id) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "该容器已被方案引用，无法删除");
        }
        containerMapper.deleteById(id);
    }

    private static String stripImportedPrefix(String name) {
        if (name == null) return null;
        return name.startsWith(IMPORTED_CONTAINER_PREFIX) ? name.substring(IMPORTED_CONTAINER_PREFIX.length()) : name;
    }
}
