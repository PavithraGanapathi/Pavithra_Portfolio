package com.example.portfolio.controller;
import com.example.portfolio.model.Project;
import com.example.portfolio.service.ProjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin


public class ProjectController {

    @Autowired
    private ProjectService service;

    @GetMapping
    public List<Project> getAllProjects() {
        return service.getAllProjects();
    }

    @PostMapping
    public Project addProject(@RequestBody Project project) {
        return service.saveProject(project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable int id) {
        service.deleteProject(id);
    }
}
