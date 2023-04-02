package com.itmentor.itmentor_rest_security.repository;

import com.itmentor.itmentor_rest_security.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAll();

//    User save(User user);
    @Transactional
    User save(User user);

    Optional<User> findById(Long id);

    Optional<User> findByName(String name);

    @Transactional
    void deleteUserById(Long id);
}
