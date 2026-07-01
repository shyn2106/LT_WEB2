# Đồ Án Lập Trình Web 2 - Quản Lý Dịch Vụ (Service Management)

Dự án này là một ứng dụng Web Backend được xây dựng bằng **Spring Boot**, phục vụ cho việc quản lý các dịch vụ (Services). Dự án cung cấp các nền tảng cơ bản về tương tác cơ sở dữ liệu (Database) thông qua JPA/Hibernate và cung cấp các API để tương tác với dữ liệu.

---

## 🎯 Tính Năng Chính (Dự Kiến)
- **Quản lý Dịch vụ (CRUD Service):**
  - Xem danh sách tất cả các dịch vụ hiện có.
  - Thêm mới một dịch vụ vào hệ thống.
  - Cập nhật thông tin chi tiết (tên, giá, mô tả, trạng thái) của dịch vụ.
  - Xóa hoặc vô hiệu hóa dịch vụ.
- **Tìm kiếm & Lọc dữ liệu:** Hỗ trợ tìm kiếm dịch vụ theo tên hoặc phân loại theo trạng thái (đang hoạt động / ngừng hoạt động).

---

## 🏗️ Cấu Trúc Dữ Liệu Chi Tiết

### Entity `Service`
Được định nghĩa trong package `LT_Web2.DoAn.entity`, class `Service` chịu trách nhiệm ánh xạ (mapping) trực tiếp xuống bảng `services` trong cơ sở dữ liệu quan hệ (như MySQL, PostgreSQL).

**Chi tiết các trường (Fields):**

| Tên Thuộc Tính | Kiểu Dữ Liệu | Chú Thích (Annotation) | Mô Tả |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `@Id`, `@GeneratedValue` | Khóa chính của bảng, tự động tăng (AUTO_INCREMENT). Dùng để định danh duy nhất mỗi dịch vụ. |
| `serviceName`| `String` | | Tên của dịch vụ được cung cấp. |
| `price` | `Double` | | Giá cả của dịch vụ. |
| `description` | `String` | | Đoạn văn bản mô tả chi tiết các thông tin về dịch vụ. |
| `status` | `Boolean` | | Trạng thái hiện tại của dịch vụ. (vd: `true` = Đang cung cấp, `false` = Tạm ngưng). |

**Các Annotations được sử dụng:**
- `@Entity`: Đánh dấu class này là một JPA Entity.
- `@Table(name = "services")`: Chỉ định tên bảng trong database là `services`.
- `@Data` (Lombok): Tự động sinh ra các phương thức Boilerplate code như `getter`, `setter`, `equals()`, `hashCode()`, và `toString()` lúc compile.

---

## 🛠️ Công Nghệ & Thư Viện Sử Dụng
- **Ngôn ngữ:** Java (JDK 11 / 17 trở lên).
- **Framework:** Spring Boot (Spring Web, Spring Boot DevTools).
- **Cơ sở dữ liệu:** Spring Data JPA / Hibernate (Hỗ trợ tương tác ORM mạnh mẽ).
- **Database Engine:** MySQL / PostgreSQL / H2 (Tùy thuộc vào cấu hình).
- **Công cụ hỗ trợ:**
  - **Lombok:** Rút gọn code cho các Model/Entity.
  - **Maven/Gradle:** Quản lý thư viện và dependencies.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu hệ thống (Prerequisites)
- Đã cài đặt [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) (phiên bản 11 hoặc 17).
- Đã cài đặt [Maven](https://maven.apache.org/) (hoặc Gradle).
- Đã cài đặt hệ quản trị CSDL (ví dụ: MySQL Server) và một công cụ quản lý DB như MySQL Workbench hoặc DBeaver.

### 2. Cấu hình Cơ Sở Dữ Liệu
Mở file `src/main/resources/application.properties` (hoặc `application.yml`) và điền thông tin kết nối CSDL của bạn:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ten_database_cua_ban
spring.datasource.username=root
spring.datasource.password=mat_khau_cua_ban

# Hibernate properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```
> **Lưu ý:** Thuộc tính `spring.jpa.hibernate.ddl-auto=update` sẽ tự động tạo bảng `services` dựa trên cấu trúc của file `Service.java` khi bạn chạy ứng dụng lần đầu.

### 3. Chạy Ứng Dụng
Sử dụng IDE (IntelliJ IDEA, Eclipse, VS Code) để chạy file Main (thường có đuôi `...Application.java` chứa hàm `main`).
Hoặc sử dụng command line ở thư mục gốc của dự án:
```bash
mvn spring-boot:run
```

Sau khi ứng dụng khởi động thành công, nó sẽ chạy trên cổng mặc định là `8080` (trừ khi được cấu hình khác).

---

## 🌐 Danh sách API Dự Kiến (RESTful)
*Đây là các endpoint thường được thiết kế đi kèm với Entity Service trong kiến trúc Controller.*

| HTTP Method | Endpoint | Mô Tả |
| :--- | :--- | :--- |
| **GET** | `/api/services` | Lấy danh sách toàn bộ các dịch vụ |
| **GET** | `/api/services/{id}` | Lấy thông tin chi tiết của một dịch vụ theo ID |
| **POST** | `/api/services` | Tạo mới một dịch vụ |
| **PUT** | `/api/services/{id}` | Cập nhật thông tin dịch vụ đã có |
| **DELETE**| `/api/services/{id}` | Xóa hoặc vô hiệu hóa dịch vụ |

---

## 📝 Thông tin Đồ Án
- **Môn học:** Lập trình Web 2
- **Giảng viên hướng dẫn:** Thầy Phát
- **Thư mục lưu trữ:** `p:\LTWEB2_THAYPHAT\DoAn...`
@