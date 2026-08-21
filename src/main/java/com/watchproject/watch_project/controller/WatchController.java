package com.watchproject.watch_project.controller;

import com.watchproject.watch_project.model.Watch;
import com.watchproject.watch_project.repository.WatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watches")
@CrossOrigin(origins = "http://localhost:5173")
public class WatchController {

    @Autowired
    private WatchRepository watchRepository;

    @GetMapping
    public List<Watch> getAllWatches() {
        return watchRepository.findAll();
    }

    @PostMapping
    public Watch createWatch(@RequestBody Watch watch) {
        return watchRepository.save(watch);
    }
}