// 導航列滾動效果
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// 移動端菜單切換
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    navLinks.classList.toggle('mobile-open');
    mobileMenuBtn.classList.toggle('active');
}

// 隱藏所有卡片細節
function showDetail(type) {
    document.querySelectorAll('.card-detail').forEach(el => {
        el.style.display = 'none';
    });

// 顯示使用者點擊的那一個
    const target = document.getElementById(type);
    if (target) {
        target.style.display = 'block';
    }
}

// 點擊導航連結後關閉移動端菜單
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.classList.remove('active');
    });
});

// 分享功能
function shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('來看看這個超棒的AI學習資源網站！一起進入AI的世界吧！');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
    showToast('已開啟Facebook分享視窗');
}

function shareToLine() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('來看看這個超棒的AI學習資源網站！一起進入AI的世界吧！');
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
    showToast('已開啟LINE分享視窗');
}

function copyLink() {
    const url = window.location.href;
    
    // 使用現代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('✅ 連結已複製到剪貼簿！可以分享給朋友了');
        }).catch(() => {
            fallbackCopyTextToClipboard(url);
        });
    } else {
        fallbackCopyTextToClipboard(url);
    }
}

// 備用複製方法（適用於舊瀏覽器）
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('✅ 連結已複製到剪貼簿！可以分享給朋友了');
        } else {
            showToast('❌ 複製失敗，請手動複製網址');
        }
    } catch (err) {
        showToast('❌ 複製失敗，請手動複製網址');
    }
    
    document.body.removeChild(textArea);
}

// 顯示提示訊息
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 顯示當前網址
document.addEventListener('DOMContentLoaded', function() {
    const urlElement = document.getElementById('page-url');
    if (urlElement) {
        urlElement.textContent = window.location.href;
    }
    
    // 初始化動畫
    initAnimations();
    
    // 初始化平滑滾動
    initSmoothScroll();
});

// 頁面載入動畫
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    entry.target.style.transition = 'all 0.6s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 觀察所有需要動畫的元素
    const animatedElements = document.querySelectorAll(
        '.why-card, .path-step, .concept-card, .tool-card, .resource-card, .insight-card, .file-card'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// 平滑滾動
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 80; // 考慮導航列高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 檔案查看功能
function viewFile(filePath, fileType) {
    const modal = document.getElementById('file-modal');
    const preview = document.getElementById('file-preview');
    const notice = document.getElementById('ppt-notice');
    const title = document.getElementById('modal-title');
    
    if (fileType === 'pdf') {
        // PDF 可以直接在瀏覽器預覽
        preview.style.display = 'block';
        notice.style.display = 'none';
        preview.src = filePath;
        title.textContent = 'PDF 預覽';
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滾動
    } else if (fileType === 'ppt' || fileType === 'pptx') {
        // PPT 無法直接在瀏覽器預覽，顯示提示
        preview.style.display = 'none';
        notice.style.display = 'block';
        title.textContent = 'PPT 簡報';
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        // 其他檔案類型
        preview.style.display = 'block';
        notice.style.display = 'none';
        preview.src = filePath;
        title.textContent = '檔案預覽';
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// 關閉模態視窗
function closeFileModal() {
    const modal = document.getElementById('file-modal');
    const preview = document.getElementById('file-preview');
    modal.style.display = 'none';
    modal.classList.remove('show');
    preview.src = ''; // 清除iframe內容
    document.body.style.overflow = ''; // 恢復背景滾動
}

// 點擊模態視窗外部關閉
window.onclick = function(event) {
    const modal = document.getElementById('file-modal');
    if (event.target === modal) {
        closeFileModal();
    }
}

// ESC 鍵關閉模態視窗
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeFileModal();
    }
});

// 數字動畫效果
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = stat.textContent;
        if (target.includes('+')) {
            const number = parseInt(target);
            if (!isNaN(number)) {
                let current = 0;
                const increment = number / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        stat.textContent = number + '+';
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + '+';
                    }
                }, 30);
            }
        }
    });
}

// 當統計區塊進入視窗時啟動動畫
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// 添加滾動到頂部按鈕（可選功能）
let scrollTopBtn = null;

function createScrollTopButton() {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    `;
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'translateY(20px)';
        }
    });
}

// 初始化滾動到頂部按鈕
createScrollTopButton();

// 添加移動端導航樣式（通過JavaScript動態添加）
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(15, 23, 42, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            border-bottom: 1px solid var(--border-color);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-links.mobile-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-link {
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .nav-share-btn {
            width: 100%;
            margin-top: 1rem;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);
