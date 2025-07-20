/**
 * ===================================================================================
 * SCRIPT THỐNG KÊ CHI TIÊU SHOPEE (PHIÊN BẢN CONSOLE + XUẤT EXCEL XLSX)
 * * Hướng dẫn:
 * 1. Mở trang Shopee.vn và đăng nhập vào tài khoản của bạn.
 * 2. Mở Công cụ cho nhà phát triển (Nhấn F12 hoặc Ctrl+Shift+I).
 * 3. Chuyển qua tab "Console".
 * 4. Dán toàn bộ đoạn code này vào và nhấn Enter.
 * 5. Chờ script chạy xong, xem kết quả trong Console và file Excel (XLSX) sẽ tự động được tải về.
 * ===================================================================================
 */

async function thongKeChiTieuShopee() {
    console.log("%cBắt đầu quá trình thống kê chi tiêu Shopee...", "color: blue; font-size: 16px; font-weight: bold;");

    try {
        // Tải thư viện SheetJS để xử lý file XLSX
        await loadScript('https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js');
        console.log('%cThư viện SheetJS để xuất Excel đã được tải thành công.', 'color: green;');

        const allProducts = await fetchAllOrders();

        if (allProducts.length === 0) {
            console.warn("%cKhông tìm thấy đơn hàng nào hoặc có lỗi khi lấy dữ liệu. Bạn đã đăng nhập vào Shopee chưa?", "color: orange; font-size: 14px;");
            return;
        }

        const summary = calculateSummary(allProducts);
        
        logConsoleSummary(summary);

        // ĐÃ XÓA: Phần hiển thị bảng chi tiết trên console đã được loại bỏ theo yêu cầu.

        console.log("%cĐang chuẩn bị file Excel (XLSX) để tải xuống...", "color: blue; font-size: 14px;");
        const dataForExport = allProducts.map(p => ({
            'Mã đơn hàng': p['Mã đơn hàng'],
            'Tên sản phẩm': p['Tên sản phẩm'],
            'Loại sản phẩm': p['Loại sản phẩm'],
            'Số lượng': p['Số lượng'],
            'Đơn giá chưa giảm': p['Đơn giá chưa giảm'],
            'Tổng giá trị': p['Tổng giá trị'],
            'Tiết kiệm được': p['Tiết kiệm được']
        }));

        // Gọi hàm downloadXLSX với summary để tính tổng
        downloadXLSX(dataForExport, summary, 'thong-ke-shopee.xlsx');
        console.log("%cTải file Excel (XLSX) thành công! Vui lòng kiểm tra thư mục Downloads của bạn.", "color: green; font-size: 16px; font-weight: bold;");


    } catch (error) {
        console.error("Đã xảy ra lỗi nghiêm trọng:", error);
        console.error(`%cVui lòng kiểm tra lại kết nối và chắc chắn bạn đang ở trang Shopee.vn đã đăng nhập. Lỗi: ${error.message}`, "font-size: 14px;");
    }
}

/**
 * Tải một script từ URL và trả về một Promise
 * @param {string} url URL của script cần tải
 */
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Không thể tải script từ: ${url}`));
        document.head.appendChild(script);
    });
}


/**
 * Lấy tất cả đơn hàng từ các trang API
 */
async function fetchAllOrders() {
    let offset = 0;
    const limit = 20; // Số đơn hàng mỗi lần gọi API
    let hasMore = true;
    const allProducts = [];
    let totalOrdersFetched = 0;

    while (hasMore) {
        console.log(`Đang lấy dữ liệu... Đã quét ${totalOrdersFetched} đơn hàng.`);
        const url = `https://shopee.vn/api/v4/order/get_order_list?list_type=3&offset=${offset}&limit=${limit}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Lỗi mạng: ${response.status} ${response.statusText}`);
            }
            const jsonResponse = await response.json();

            if (jsonResponse.error) {
                throw new Error(`Lỗi từ Shopee API: ${jsonResponse.error_msg || 'Vui lòng đăng nhập'}`);
            }

            const orders = jsonResponse.data?.details_list || [];
            if (orders.length === 0) {
                hasMore = false;
                continue;
            }
            
            totalOrdersFetched += orders.length;
            processOrders(orders, allProducts);

            offset += limit;
            hasMore = orders.length >= limit;

        } catch (error) {
            console.error(`Lỗi khi lấy đơn hàng tại offset ${offset}:`, error);
            hasMore = false; // Dừng lại nếu có lỗi
            throw error; // Ném lỗi ra ngoài để hàm chính xử lý
        }
    }
    console.log(`%cQuét dữ liệu hoàn tất! Đã xử lý ${totalOrdersFetched} đơn hàng.`, "color: green; font-size: 14px;");
    return allProducts;
}

/**
 * Xử lý dữ liệu từ một lô đơn hàng và thêm vào danh sách tổng
 */
function processOrders(orders, allProducts) {
     orders.forEach(order => {
        const orderId = order.info_card?.order_id;
        const orderFinalTotal = (order.info_card?.final_total || 0) / 100000;
        let orderOriginalTotal = 0;
        const itemsInOrder = [];

        order.info_card?.order_list_cards.forEach(card => {
            card.product_info?.item_groups.forEach(group => {
                group.items.forEach(item => {
                    const originalPrice = (item.item_price || 0) / 100000;
                    const amount = item.amount || 0;
                    orderOriginalTotal += originalPrice * amount;
                    itemsInOrder.push(item);
                });
            });
        });

        // SỬA LỖI: Đã sửa lại công thức tính discountRatio cho chính xác
        const discountRatio = (orderOriginalTotal > 0 && orderFinalTotal > 0) ? (orderFinalTotal / orderOriginalTotal) : 1;

        itemsInOrder.forEach(item => {
            const originalPrice = (item.item_price || 0) / 100000;
            const amount = item.amount || 0;
            const discountedPrice = originalPrice * discountRatio;

            allProducts.push({
                'Mã đơn hàng': orderId,
                'Tên sản phẩm': item.name,
                'Loại sản phẩm': item.model_name || 'N/A',
                'Mã sản phẩm': item.model_id,
                'Số lượng': amount,
                'Đơn giá chưa giảm': originalPrice,
                'Đơn giá đã giảm': discountedPrice,
                'Tổng giá trị': discountedPrice * amount,
                'Tiết kiệm được': (originalPrice - discountedPrice) * amount,
            });
        });
    });
}

/**
 * Tính toán các số liệu tổng hợp từ danh sách sản phẩm
 */
function calculateSummary(allProducts) {
    const summary = allProducts.reduce((acc, product) => {
        acc.totalSpent += product['Tổng giá trị'];
        acc.totalOriginal += product['Đơn giá chưa giảm'] * product['Số lượng'];
        acc.totalItems += product['Số lượng'];
        acc.orderIds.add(product['Mã đơn hàng']);
        return acc;
    }, {
        totalSpent: 0,
        totalOriginal: 0,
        totalItems: 0,
        orderIds: new Set(),
    });

    return {
        totalSpent: summary.totalSpent,
        totalSaved: summary.totalOriginal - summary.totalSpent,
        totalItems: summary.totalItems,
        totalOrders: summary.orderIds.size,
    };
}

/**
 * Log kết quả tổng hợp ra Console
 */
function logConsoleSummary(summary) {
    console.log('================================');
    console.log('%c' + getPXGCert(summary.totalSpent), 'font-size:26px; color: #d97706; font-weight: bold;');
    console.log('%c(1)Số tiền bạn ĐÃ ĐỐT vào Shopee là: ' + '%c' + formatPrice(summary.totalSpent) + ' vnđ%c', 'font-size: 20px;', 'font-size: 26px; color:orange;font-weight:700', 'font-size: 20px;');
    console.log('================================');
    console.log('%c(2)Tổng đơn hàng đã giao: ' + '%c' + formatPrice(summary.totalOrders, 0) + ' đơn hàng', 'font-size: 20px;', 'font-size: 20px; color:green');
    console.log('%c(3)Số lượng sản phẩm đã đặt: ' + '%c' + formatPrice(summary.totalItems, 0) + ' sản phẩm', 'font-size: 20px;', 'font-size: 20px; color:#fc0000');
    console.log('%c(4)Tổng tiền TIẾT KIỆM được nhờ săn sale: ' + '%c' + formatPrice(summary.totalSaved) + ' vnđ', 'font-size: 18px;', 'font-size: 18px; color:green');
    console.log('%c💰TỔNG TIẾT KIỆM: ' + '%c' + formatPrice(summary.totalSaved) + ' vnđ', 'font-size: 24px;', 'font-size: 24px; color:orange;font-weight:700');
    console.log('================================');
}

// --- Các hàm tiện ích ---
function getPXGCert(pri) {
    if (pri <= 10000000) return 'HÊN QUÁ! BẠN CHƯA BỊ SHOPEE GÂY NGHIỆN 😍';
    if (pri > 10000000 && pri <= 50000000) return 'THÔI XONG! BẠN BẮT ĐẦU NGHIỆN SHOPEE RỒI 😂';
    if (pri > 50000000 && pri < 80000000) return 'ỐI GIỜI ƠI! BẠN LÀ CON NGHIỆN SHOPEE CHÍNH HIỆU �';
    return 'XÓA APP SHOPEE THÔI! BẠN NGHIỆN SHOPEE NẶNG QUÁ RỒI 😝';
}

function formatPrice(number, fixed = 2) {
    if (isNaN(number)) return 0;
    number = Number(number.toFixed(fixed));
    return number.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// --- MỚI: HÀM XUẤT FILE XLSX ---

/**
 * Tạo và tải file XLSX sử dụng thư viện SheetJS
 * @param {Array<Object>} data Mảng dữ liệu sản phẩm
 * @param {Object} summary Dữ liệu tổng hợp
 * @param {string} filename Tên file để tải về
 */
function downloadXLSX(data, summary, filename) {
    // Tạo một worksheet từ mảng dữ liệu JSON
    const ws = XLSX.utils.json_to_sheet(data);

    // Thêm dòng tổng cộng
    const totalRow = {
        'Tên sản phẩm': 'TỔNG CỘNG:',
        'Tổng giá trị': summary.totalSpent,
        'Tiết kiệm được': summary.totalSaved
    };
    XLSX.utils.sheet_add_json(ws, [totalRow], {
        header: Object.keys(data[0]),
        skipHeader: true,
        origin: -1
    });

    // Định dạng các cột tiền tệ là kiểu số
    const range = XLSX.utils.decode_range(ws['!ref']);
    // Các cột cần định dạng (E, F, G) tương ứng với 'Đơn giá chưa giảm', 'Tổng giá trị', 'Tiết kiệm được'
    const moneyColumns = [4, 5, 6]; 
    for (let R = range.s.r + 1; R <= range.e.r; ++R) { // Bắt đầu từ dòng 2 (index 1) để bỏ qua header
        moneyColumns.forEach(C => {
            const cell_address = { c: C, r: R };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            if (ws[cell_ref] && ws[cell_ref].v !== undefined) {
                 ws[cell_ref].t = 'n'; // 'n' for number
                 ws[cell_ref].z = '#,##0'; // Định dạng số có dấu phẩy, không có số thập phân
            }
        });
    }
    
    // Tạo một workbook mới
    const wb = XLSX.utils.book_new();
    
    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "ThongKeShopee");
    
    // Ghi file và kích hoạt tải xuống
    XLSX.writeFile(wb, filename);
}


// Tự động chạy hàm chính
thongKeChiTieuShopee();
�
