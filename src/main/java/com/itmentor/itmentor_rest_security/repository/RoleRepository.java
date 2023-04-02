package com.itmentor.itmentor_rest_security.repository;

import com.itmentor.itmentor_rest_security.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String roleName);
    Role getRoleById(Long id);
    List<Role> findAll();
}
