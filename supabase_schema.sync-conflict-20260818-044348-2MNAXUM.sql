-- 1. Products Table (상품 마스터 정보 테이블)
CREATE TABLE public.products (
    id UUID DEFAULT auth.uid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    name TEXT NOT NULL,                 -- 관리용 상품명
    sku TEXT UNIQUE,                    -- 상품 고유 코드
    category TEXT,                      -- 카테고리
    
    -- 원가 및 마진 기준
    cost_price INTEGER NOT NULL,        -- 매입 원가
    min_margin_rate FLOAT NOT NULL,     -- 최소 마진율 (%)
    standard_price INTEGER NOT NULL,    -- 표준 판매가
    my_shipping_fee INTEGER DEFAULT 3000, -- 내 쇼핑몰 배송비

    -- 경쟁사 추적 (Input)
    target_catalog_url TEXT,            -- 네이버 카탈로그 URL
    
    -- 가격 방어 전략 (Rules)
    strategy_type TEXT DEFAULT 'TARGET_MINUS_N', -- 전략 타입
    adjust_amount INTEGER DEFAULT 100,           -- 차감 금액
    step_unit INTEGER DEFAULT 100,               -- 절사 단위
    use_margin_defense BOOLEAN DEFAULT true,     -- 마진 방어선 사용 여부
    use_circuit_breaker BOOLEAN DEFAULT true,    -- 급락 방지 사용 여부
    circuit_breaker_limit_pct FLOAT DEFAULT 10.0, -- 급락 한계 (%)

    -- 모니터링 관리
    is_active BOOLEAN DEFAULT false,    -- 현 상품 자동 가격 추적 활성화 여부
    current_market_price INTEGER        -- 내 마켓에 실제 반영된 최근 가격 (피드백용)
);

-- 2. Price Logs Table (가격 조정 히스토리)
CREATE TABLE public.price_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    
    competitor_lowest_price INTEGER, -- 그 당시 스크랩된 경쟁사 최저가 총액 (참고용)
    old_price INTEGER NOT NULL,      -- 변경 전 가격
    new_price INTEGER NOT NULL,      -- 엔진이 계산한 새 타겟 가격
    
    reason TEXT NOT NULL             -- 이유 (마진 방어 등)
);

-- Row Level Security (필요에 따라 설정)
-- ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.price_logs ENABLE ROW LEVEL SECURITY;
