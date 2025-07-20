# shopee-order-history-exporter
A script to export your Shopee order history to an XLSX file

Giới thiệu

Bạn đã bao giờ tò mò mình đã "đốt" bao nhiêu tiền vào Shopee chưa? Script này ra đời để trả lời câu hỏi đó. Bằng cách chạy một đoạn mã Javascript đơn giản ngay trên trình duyệt, bạn có thể lấy toàn bộ dữ liệu từ lịch sử đơn hàng đã hoàn thành, xem báo cáo tổng quan ngay tại cửa sổ Console và xuất ra một file Excel chuyên nghiệp để lưu trữ hoặc phân tích sâu hơn.

Hình ảnh Minh họa
<img width="2726" height="1506" alt="image" src="https://github.com/user-attachments/assets/df6c7ed8-a5a9-4e5b-bd27-e4f478c96508" />

Kết quả hiển thị trên Console và file Excel được tải về.
<img width="2756" height="226" alt="image" src="https://github.com/user-attachments/assets/d7e99a79-1b27-498f-95ae-e53ba7089892" />


✨ Tính năng Nổi bật

📊 Thống kê Tổng quan: Nhanh chóng xem tổng số tiền đã chi, tổng tiền tiết kiệm được qua voucher/khuyến mãi, tổng số đơn hàng và tổng số sản phẩm đã mua.

📋 Liệt kê Chi tiết: Hiển thị một bảng chi tiết tất cả các sản phẩm đã mua ngay trên Console, bao gồm tên sản phẩm, loại sản phẩm, số lượng và các thông tin về giá.

📄 Xuất ra file Excel (.xlsx): Tự động tạo và tải về một file Excel chứa toàn bộ dữ liệu chi tiết, sẵn sàng để bạn phân tích hoặc lưu trữ.

🔢 Định dạng Số chuyên nghiệp: Các cột tiền tệ trong file Excel được định dạng kiểu số, giúp bạn có thể tính toán (SUM, AVERAGE,...) một cách dễ dàng.

➕ Dòng Tổng kết trong Excel: Tự động thêm một dòng tổng cộng cho các cột quan trọng như "Tổng giá trị" và "Tiết kiệm được" ở cuối file Excel.

🚀 Không cần cài đặt: Chỉ cần sao chép và dán. Script chạy hoàn toàn trên trình duyệt của bạn mà không cần cài đặt bất kỳ phần mềm hay tiện ích mở rộng nào.

🚀 Cách sử dụng
Thực hiện theo các bước đơn giản sau để bắt đầu:

1. Đăng nhập Shopee: Mở trình duyệt (khuyến nghị dùng Chrome hoặc Firefox), truy cập trang https://shopee.vn và đăng nhập vào tài khoản của bạn.

2. Mở Công cụ Lập trình viên:

- Windows/Linux: Nhấn F12 hoặc Ctrl + Shift + I.

- macOS: Nhấn Cmd + Opt + I.

3. Chuyển qua tab Console: Trong cửa sổ vừa mở, tìm và nhấp vào tab có tên là Console.

4. Sao chép và Dán Script:

- Mở file script.js trong kho chứa này.

- Sao chép toàn bộ nội dung của file.

- Quay lại tab Console trên trình duyệt và dán đoạn mã vừa sao chép vào.

5. Chạy Script: Nhấn phím Enter.

6. Chờ và Xem kết quả: Script sẽ tự động chạy, lấy dữ liệu qua từng trang đơn hàng (bạn sẽ thấy các dòng log Đang lấy dữ liệu...). Sau khi hoàn tất, kết quả tổng quan và bảng chi tiết sẽ hiện ra trên Console, đồng thời một file thong-ke-shopee.xlsx sẽ được tự động tải về máy của bạn.

⚙️ Công nghệ sử dụng
JavaScript (ES6+): Script được viết bằng Javascript thuần, sử dụng các cú pháp hiện đại như async/await và Promise để xử lý các tác vụ bất đồng bộ.

SheetJS (xlsx): Sử dụng thư viện SheetJS được tải tự động từ CDN để tạo và xử lý file .xlsx.

⚠️ Cảnh báo & Miễn trừ Trách nhiệm
Đây là một dự án cá nhân và không phải là công cụ chính thức từ Shopee.

Script này được tạo ra cho mục đích học tập và thống kê cá nhân. Vui lòng sử dụng một cách có trách nhiệm.

Script chỉ thực hiện các tác vụ đọc dữ liệu (GET requests) từ API của Shopee mà bạn có quyền truy cập khi đã đăng nhập. Nó không gửi, thay đổi hay xóa bất kỳ dữ liệu nào trên tài khoản của bạn.

Shopee có thể thay đổi cấu trúc API của họ bất cứ lúc nào, điều này có thể làm cho script ngừng hoạt động. Nếu gặp lỗi, hãy tạo một "Issue" trên kho chứa này.

🤝 Đóng góp
Mọi sự đóng góp đều được hoan nghênh! Nếu bạn có ý tưởng để cải thiện script hoặc sửa lỗi, vui lòng tạo một "Pull Request" hoặc một "Issue" để chúng ta có thể thảo luận.

Fork kho chứa này.

Tạo một nhánh mới (git checkout -b feature/AmazingFeature).

Thực hiện các thay đổi của bạn và commit (git commit -m 'Add some AmazingFeature').

Push lên nhánh của bạn (git push origin feature/AmazingFeature).

Mở một Pull Request.
