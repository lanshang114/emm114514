document.addEventListener('DOMContentLoaded', function() {
    // 折叠菜单控制（修复关闭问题）
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡导致立即关闭
        mobileMenu.classList.toggle('active');
    });

    // 点击页面其他区域关闭折叠菜单
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !menuToggle.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });

    // 用户评价轮播（修复最后一个显示不全问题）
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const totalCards = testimonialCards.length;

    // 计算可见卡片数量并考虑间距
    function getVisibleCount() {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    // 计算卡片宽度（包含间距）
    function getCardWidth() {
        const visibleCount = getVisibleCount();
        const gap = 16; // 与CSS中gap保持一致（1rem=16px）
        const containerWidth = carousel.parentElement.clientWidth;
        const totalGap = gap * (visibleCount - 1);
        return (containerWidth - totalGap) / visibleCount;
    }

    // 更新轮播位置
    function updateCarousel() {
        const visibleCount = getVisibleCount();
        const maxIndex = Math.max(0, totalCards - visibleCount);
        
        // 限制索引范围，确保最后一张能完全显示
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        
        // 计算精确偏移量（包含间距补偿）
        const cardWidth = getCardWidth();
        const gap = 16;
        const offset = currentIndex * (cardWidth + gap);
        carousel.style.transform = `translateX(-${offset}px)`;
    }

    // 轮播按钮事件
    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        const visibleCount = getVisibleCount();
        currentIndex = Math.min(totalCards - visibleCount, currentIndex + 1);
        updateCarousel();
    });

    // 窗口大小改变时重新计算（确保响应式正确）
    window.addEventListener('resize', () => {
        // 重新计算位置防止显示异常
        const visibleCount = getVisibleCount();
        currentIndex = Math.min(currentIndex, totalCards - visibleCount);
        updateCarousel();
    });

    // FAQ折叠功能
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // 关闭其他已展开的答案
            document.querySelectorAll('.faq-answer').forEach(item => {
                if (item !== answer && item.style.maxHeight) {
                    item.style.maxHeight = null;
                    item.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
                }
            });
            
            // 切换当前答案显示状态
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // 导航链接平滑滚动
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 预留导航栏高度
                    behavior: 'smooth'
                });
                
                // 滚动后关闭菜单
                mobileMenu.classList.remove('active');
            }
        });
    });

    // 初始化轮播
    updateCarousel();
});