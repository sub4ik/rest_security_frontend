package com.itmentor.itmentor_rest_security.controller;

import com.itmentor.itmentor_rest_security.model.Role;
import com.itmentor.itmentor_rest_security.model.User;
import com.itmentor.itmentor_rest_security.model.UserRequestForm;
import com.itmentor.itmentor_rest_security.service.RegistrationService;
import com.itmentor.itmentor_rest_security.service.RoleService;
import com.itmentor.itmentor_rest_security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RegistrationService registrationService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminController(UserService userService, RegistrationService registrationService, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.registrationService = registrationService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User users = userService.read(id);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getAuthenticatedUser(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(user);
    }

    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody UserRequestForm user, BindingResult result) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User newUser = userService.create(user);
        return ResponseEntity.ok(newUser);
    }

    /*@GetMapping("/edit/{id}")
    public String showEditUserForm(@PathVariable("id") Long id, Model model) {
        User user = userService.read(id);
        List<Role> roles = roleService.getAllRoles();
        model.addAttribute("user", user);
        model.addAttribute("roles", roles);
        return "admin/editUserForm";
    }*/

    @PostMapping("/edit")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        System.out.println(user.getRoles());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.updateUser(user);
        return ResponseEntity.ok(user);
    }
//    @PostMapping("/edit")
//    public ResponseEntity<User> updateUser(@ModelAttribute("user") User user) {
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        userService.updateUser(user);
//        return ResponseEntity.ok(user);
//    }

    @PostMapping("/delete")
    public ResponseEntity<User> deleteUser(@RequestParam("id") Long id) {
        userService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

