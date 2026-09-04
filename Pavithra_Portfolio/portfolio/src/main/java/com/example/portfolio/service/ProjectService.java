package com.example.portfolio.service;

import com.example.portfolio.model.Project;
import com.example.portfolio.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository repo;

    public List<Project> getAllProjects() {
        return repo.findAll();
    }

    public Project saveProject(Project project) {
        return repo.save(project);
    }

    public void deleteProject(int id) {
        repo.deleteById(id);
    }
}
