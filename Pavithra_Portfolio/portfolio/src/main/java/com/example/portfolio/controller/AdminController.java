package com.example.portfolio.controller;

import com.example.portfolio.model.Admin;
import com.example.portfolio.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService service;

    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {
        return service.login(admin.getUsername(), admin.getPassword());
    }
}
