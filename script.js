document.addEventListener('DOMContentLoaded', () => {

    // --- ヘッダーの追従 
    const header = document.querySelector('header');
    const fv = document.getElementById('fv');

    window.addEventListener('scroll', () => {
        const fvHeight = fv.offsetHeight;
        const scrollY = window.scrollY + 256;
        if (scrollY > fvHeight) {
            header.classList.add('header-show');
        } else {
            header.classList.remove('header-show');
        }
    });

    // --- 利用者の声スライダー
    const sheetsContainer = document.getElementById('sheets');
    let sheets = document.querySelectorAll('.sheet');
    const gems = document.querySelectorAll('.gem');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');

    let isAnimating = false;
    const firstClone = sheets[0].cloneNode(true);
    const lastClone = sheets[sheets.length - 1].cloneNode(true);

    sheetsContainer.appendChild(firstClone);
    sheetsContainer.insertBefore(lastClone, sheets[0]);

    sheets = document.querySelectorAll('.sheet');
    let currentIndex = 1;

    function updateGems() {
        const realIndex = (currentIndex - 1 + gems.length) % gems.length;

        gems.forEach((gem, index) => {
            if (index === realIndex) {
                gem.src = "images/gem_red.svg";
            } else {
                gem.src = "images/gem_blue.svg";
            }
        });
    }

    function updateSlider(useTransition = true) {
        const sheetStyle = window.getComputedStyle(sheets[0]);
        const sheetWidth = sheets[0].offsetWidth;
        const containerStyle = window.getComputedStyle(sheetsContainer);
        const gap = parseFloat(containerStyle.gap) || 60; // PCとSPでgapが違う場合もこれで対応可

        const slideWidth = sheetWidth + gap;
        const offset = (window.innerWidth / 2) - (sheetWidth / 2);
        const moveDistance = (slideWidth * currentIndex) - offset;

        if (useTransition) {
            sheetsContainer.style.transition = 'transform 0.5s ease-in-out';
        } else {
            sheetsContainer.style.transition = 'none';
        }

        sheetsContainer.style.transform = `translateX(-${moveDistance}px)`;
        updateGems();
    }

    rightBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        currentIndex++;
        updateSlider(true);

        setTimeout(() => {
            if (currentIndex === sheets.length - 1) {
                currentIndex = 1;
                updateSlider(false);
            }
            isAnimating = false;
        }, 500);
    });

    leftBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        currentIndex--;
        updateSlider(true);

        setTimeout(() => {
            if (currentIndex === 0) {
                currentIndex = sheets.length - 2;
                updateSlider(false);
            }
            isAnimating = false;
        }, 500);
    });

    window.addEventListener('resize', () => {
        updateSlider(false);
    });
    setTimeout(() => {
        updateSlider(false);
    }, 100);

    // --- よくある質問（アコーディオン）
    const questions = document.querySelectorAll('.question');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;

            if (question.classList.contains('active')) {
                answer.style.height = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
            } else {
                answer.style.height = '0';
                answer.style.opacity = '0';
            }
        });
    });

    window.addEventListener('resize', () => {
        document.querySelectorAll('.question.active').forEach(activeQuestion => {
            const answer = activeQuestion.nextElementSibling;
            answer.style.height = 'auto';
            answer.style.height = answer.scrollHeight + 'px';
        });
    });

    // --- スムーススクロール（申し込みフォームへ）
    // pc-onlyとsp-only両方のボタンが存在するため、すべて取得してクリックイベントを付与
    const ctaButtons = document.querySelectorAll('.hcta, .fvline .button, .tbutton, .last-ctv');
    const targetForm = document.getElementById('form');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetForm.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = targetPosition - headerHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // --- ヘッダーナビゲーションのスクロール ＆ ハンバーガーメニュー (SP・PC統合)
    const hamburger = document.getElementById('hamburger');
    const spHlist = document.querySelector('.hlist'); // SP版のul

    // ハンバーガーメニューが存在する場合（SP表示時）のみイベントを登録
    if (hamburger && spHlist) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            spHlist.classList.toggle('active');
        });
    }

    // PC版・SP版すべてのナビゲーションアイテム（li）を取得
    const navItems = document.querySelectorAll('.hlist li');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // SP版のメニューが開いている場合は閉じる処理
            if (hamburger && spHlist) {
                hamburger.classList.remove('active');
                spHlist.classList.remove('active');
            }

            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = targetPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 利用者の声の「もっと見る」機能 (SP版) ---
    const ytexts = document.querySelectorAll('.ytext');

    ytexts.forEach(ytext => {
        const readMoreBtn = document.createElement('div');
        readMoreBtn.textContent = '...もっと見る';
        readMoreBtn.classList.add('read-more', 'sp-only');

        ytext.parentNode.insertBefore(readMoreBtn, ytext.nextSibling);

        readMoreBtn.addEventListener('click', () => {
            const isExpanded = ytext.classList.toggle('expanded');

            if (isExpanded) {
                readMoreBtn.textContent = '閉じる';
                // 全文の本当の高さ（scrollHeight）を取得して動的に指定
                ytext.style.maxHeight = ytext.scrollHeight + 'px';
            } else {
                readMoreBtn.textContent = '...もっと見る';
                // 再び5行分の高さ（150px）に戻す
                ytext.style.maxHeight = '150px';
            }
        });
    });

    // --- スクロール連動アニメーション（ふわっと浮き上がる） ---
    const fadeElements = document.querySelectorAll('.fade-in-up');

    // IntersectionObserverの設定
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // 要素が20%画面内に入ったら発火する
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面に入ったら 'show' クラスを追加
                entry.target.classList.add('show');
                // 一度表示したら監視を解除する（毎回ふわっとさせたい場合はこの1行を消す）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 取得した要素を監視対象に登録
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});