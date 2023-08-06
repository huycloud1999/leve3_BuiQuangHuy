# weather-app
- Xây dựng một ứng dụng cho phép bạn xem thông tin thời tiết của một địa điểm cụ thể.
 xây dựng một ứng dụng theo dõi thời tiết, có thể bạn sẽ có hai loại người dùng chính: người dùng (users) và quản trị viên (admin). Dưới đây là một mô tả ngắn về các chức năng và vai trò của từng loại người dùng:

# Người dùng (Users):
- Xem thông tin thời tiết: Người dùng có thể xem thông tin thời tiết hiện tại của một địa điểm cụ thể, bao gồm nhiệt độ, tình trạng thời tiết (mưa, nắng, sương mù, vv.), độ ẩm, tốc độ gió, và thời gian dự báo.
- Tìm kiếm địa điểm: Người dùng có thể tìm kiếm thông tin thời tiết của các địa điểm khác nhau bằng cách nhập tên thành phố hoặc quốc gia.
- Lưu trữ địa điểm yêu thích: Người dùng có thể lưu trữ các địa điểm yêu thích để dễ dàng truy cập thông tin thời tiết của chúng trong tương lai.
Đăng ký và đăng nhập: Đăng ký tài khoản để lưu trữ danh sách địa điểm yêu thích và sử dụng tính năng cá nhân hóa. Đăng nhập để truy cập vào tài khoản đã đăng ký.
# Quản trị viên (Admin):
- Quản lý người dùng: Quản trị viên có thể quản lý thông tin về các tài khoản người dùng, bao gồm tạo, sửa đổi và xóa tài khoản.
- Quản lý địa điểm: Quản trị viên có quyền thêm, sửa đổi và xóa các địa điểm mà người dùng có thể xem thông tin thời tiết của chúng.
- Quản lý báo cáo: Nếu có chức năng báo cáo từ người dùng về thông tin thời tiết không chính xác hoặc vấn đề kỹ thuật, quản trị viên có thể xem và xử lý báo cáo này.
# CSDL
 1.Bảng "Locations" (Địa điểm):
    id: Mã duy nhất của địa điểm.
    name: Tên của địa điểm (ví dụ: thành phố, quận, hay quốc gia).
    country: Quốc gia của địa điểm.
    latitude: Vĩ độ của địa điểm.
    longitude: Kinh độ của địa điểm.

 2.Bảng "Weather" (Thông tin thời tiết):
    id: Mã duy nhất của thông tin thời tiết.
    location_id: Liên kết với bảng "Locations", xác định địa điểm của thông tin thời tiết.
    temperature: Nhiệt độ hiện tại.
    description: Mô tả tình trạng thời tiết (ví dụ: nắng, mưa, gió, ...).
    humidity: Độ ẩm hiện tại.
    wind_speed: Tốc độ gió.
    timestamp: Thời gian ghi nhận thông tin thời tiết.
    
 3. Bảng "Users" (Tài khoản người dùng):
    id: Mã duy nhất của tài khoản người dùng.
    username: Tên người dùng (dùng để đăng nhập).
    email: Địa chỉ email của người dùng.
    password: Mật khẩu đã được mã hóa (lưu ý không lưu mật khẩu thô).
    favorite_locations: Danh sách các địa điểm yêu thích của người dùng (thông qua location_id).