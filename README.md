# Human Resource Managerment

---

## Getting started

---

```
$ npm i
$ npm run syncDB
$ npm start
```

Hệ thống có các modules chính sau:

-  Quản lý users, roles, permission (1 user có thể có nhiều roles, một roles có nhiều permission) (permisson sẽ phân dựa trên 5 quyền cơ bản R, W, U, D, A (read, write, update, delete, approve)
-  Quản lý form thử việc (view, add, update, approve tùy từng role cụ thể sẽ được phép làm các quyền khác nhau)
-  Quản lý form đánh giá định kỳ hàng năm
-  Khi user login thành công cần cung cấp 1 api để lấy tất cả các quyền của user đang login (dựa vào token)
-  Quản lý thông tin cá nhân (id, mã nhân viên, firstname, lastname, email, phone, avatar, cmnd, số số BHXH, phụ thuộc, address, …etc)
-  Notifications

   -  Gửi email thông báo đến tất cả nhân viên khi (admin, HR) tạo một một form thử việc mới
   -  Gửi email thông báo đến tất cả các nhân viên khi (admin, HR) tạo một form đánh giá định kỳ hàng năm mới

-  Report

   -  Báo cáo tình trạng tất cả các nhân viên đã, chưa hoàn thành forms đánh giá thử việc
   -  Báo cáo tình trạng tất cả các nhân viên đã, chưa hoàn thành forms đánh giá định kỳ hàng năm

Hệ thống có 5 vài trò chính

Admin

-  Có tất cả các quyền
-  Tạo form thử việc cho tất cả user
-  Tạo form đánh giá định kỳ hàng năm cho tất cả user
   -Tạo user

Drirector
Có tất cả các quyền của Empoyee, Manager, HR

HR

-  Xem thông tin form thử việc của bản thân và tất cả các users có trong hệ thống
-  Xem thông tin form đánh giá định kỳ hàng năm của bản thân và tất cả các users có trong hệ thống
-  Có tất cả các quyền của Employee (vì HR cũng là employee, cũng sẽ có form thử việc, đánh giá)
-  Xem báo cáo về tình trạng hoàn thành các forms thử việc của tất cả các nhân viên đang thử việc
-  Xem báo cáo về tình trạng hoàn thành các forms đánh giá định kỳ hàng năm của tất cả các nhân viên trong công ty
-  Tạo form thử việc cho tất cả user (Giống Admin)
-  Tạo form đánh giá định kỳ hàng năm cho tất cả user (Giống Admin)

Manager

-  Xem, phê duyệt hoặc reject form thử việc (nếu manager reject thì form sẽ có trạng thái new, quay trở về status ban đầu, employee có thể sửa và submit lại)
-  Xem, phê duyệt form đánh giá định kỳ hành năm
-  Có tất cả các quyền của employee (vì manager cũng là cấp dưới của Director)

Employee

-  Xem, Sửa thông tin cá nhân (avatar, address, CMND, Số Sổ BHXH)
-  Xem, Sửa, Submit Form đánh giá thử việc (cho manager trực tiếp, nếu employee thì gửi cho manager, nếu là manager thì gửi cho Director)
-  Xem, Sửa, Gửi form đánh giá định kỳ hàng năm (cho manager trực tiếp, nếu employee thì gửi cho manager, nếu là manager thì gửi cho Director)

-  Trạng thái của form:

   -  open: Nhân viên chưa điền form đánh giá
   -  review: Nhân viên đã chuyển form đánh giá cho quản lý
   -  reject: Quản lý từ chối form đánh giá
   -  approve: Quản lý phê duyệt form đánh giá

Class Diagram

![Alt text](./public/class_diagram.png?raw=true 'class_diagram')

Entity Relationship Diagram

![Alt text](./public/entity_relationship_diagram.png?raw=true 'entity_relationship_diagram')
