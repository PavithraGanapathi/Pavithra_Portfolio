package com.example.portfolio.service;

import com.example.portfolio.model.Admin;
import com.example.portfolio.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepository repo;

    public String login(String username, String password) {
        Admin admin = repo.findByUsername(username);

        if (admin != null && admin.getPassword().equals(password)) {
            return "Logged in Successfully";
        }
        return null;
    }
}
