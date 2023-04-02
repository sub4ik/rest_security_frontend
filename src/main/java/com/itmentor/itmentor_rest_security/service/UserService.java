package com.itmentor.itmentor_rest_security.service;

import com.itmentor.itmentor_rest_security.model.User;
import com.itmentor.itmentor_rest_security.model.UserRequestForm;
import com.itmentor.itmentor_rest_security.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleService roleService;

    @Autowired
    public UserService(UserRepository userRepository, RoleService roleService) {
        this.userRepository = userRepository;
        this.roleService = roleService;
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public Optional<User> findUserByName(String name){
        return userRepository.findByName(name);
    }

    public User create(UserRequestForm user) {
        User newUser = new User();
        newUser.setName(user.getName());
        newUser.setEmail(user.getEmail());
        newUser.setRoles(roleService.getRolesByIds(user.getRoles()));
        newUser.setPassword(user.getPassword());
        userRepository.save(newUser);
        return newUser;
    }

    public User read(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User with " + id + " not found"));
    }

    public void updateUser(User user) {
        Optional<User> optionalUser = userRepository.findById(user.getId());
        if (optionalUser.isPresent()) {
            User dbUser = optionalUser.get();
            dbUser.setName(user.getName());
            dbUser.setEmail(user.getEmail());
            dbUser.setPassword(user.getPassword());
            dbUser.setRoles(user.getRoles());
            userRepository.save(dbUser);
        } else {
            // handle the case where the user is not found
        }
    }


    public void delete(User user) {
        userRepository.delete(user);
    }
    public void deleteById(Long id) {
        userRepository.deleteUserById(id);
    }
}
