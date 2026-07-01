package LT_Web2.DoAn.service;

import LT_Web2.DoAn.entity.User;
import java.util.List;

public interface UserService {
    User save(User user);
    List<User> getAll();
    User getByUsername(String username);
    User getUserById(Long id);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
}