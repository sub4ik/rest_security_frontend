package com.itmentor.itmentor_rest_security.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TemplateController {

    @GetMapping("/user/info")
    public String showUserInfo() {
        return "user/info";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin/adminPage";
    }

}
