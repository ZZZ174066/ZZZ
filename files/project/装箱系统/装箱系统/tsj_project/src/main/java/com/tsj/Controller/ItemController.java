package com.tsj.Controller;

import com.tsj.entity.Item;
import com.tsj.mapper.ItemMapper;
import com.tsj.mapper.PlanItemMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    private static final String IMPORTED_ITEM_PREFIX = "__IMPORTED_ITEM__";

    private final ItemMapper itemMapper;
    private final PlanItemMapper planItemMapper;

    public ItemController(ItemMapper itemMapper, PlanItemMapper planItemMapper) {
        this.itemMapper = itemMapper;
        this.planItemMapper = planItemMapper;
    }

    @GetMapping
    public List<Item> list(@RequestParam(value = "keyword", required = false) String keyword) {
        List<Item> all = itemMapper.selectAll();
        if (all == null) return List.of();
        return all.stream()
                .filter(i -> i != null && i.getItemName() != null)
                .peek(i -> {
                    boolean imported = i.getItemName().startsWith(IMPORTED_ITEM_PREFIX);
                    i.setOrderImported(imported);
                    i.setItemName(stripImportedPrefix(i.getItemName()));
                })
                .filter(i -> keyword == null || keyword.isBlank() || i.getItemName().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Item getById(@PathVariable Long id) {
        return itemMapper.selectById(id);
    }

    @PostMapping
    public Item create(@RequestBody Item item) {
        itemMapper.insert(item);
        return itemMapper.selectById(item.getItemId());
    }

    @PutMapping("/{id}")
    public Item update(@PathVariable Long id, @RequestBody Item item) {
        item.setItemId(id);
        itemMapper.update(item);
        return itemMapper.selectById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (planItemMapper.countByItemId(id) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "该物品已被方案引用，无法删除");
        }
        itemMapper.deleteById(id);
    }

    private static String stripImportedPrefix(String name) {
        if (name == null) return null;
        return name.startsWith(IMPORTED_ITEM_PREFIX) ? name.substring(IMPORTED_ITEM_PREFIX.length()) : name;
    }
}
