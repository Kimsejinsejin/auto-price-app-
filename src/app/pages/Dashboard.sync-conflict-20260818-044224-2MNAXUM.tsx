import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  ComposedChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  BarChart3, 
  Target, 
  ArrowUpRight,
  Download,
  Calendar
} from 'lucide-react';
import { cn } from '../utils/cn';

// --- Mock Data for Analysis ---

// 1. Price vs Sales Correlation (가격을 내렸을 때 판매량 변화) & KPI Data
const dashboardData = {
  '24h': {
    salesCorrelation: [
      { date: '00:00', price: 15200, sales: 12, revenue: 182400 },
      { date: '04:00', price: 15200, sales: 5, revenue: 76000 },
      { date: '08:00', price: 15200, sales: 25, revenue: 380000 },
      { date: '12:00', price: 14800, sales: 65, revenue: 962000 },
      { date: '16:00', price: 14800, sales: 50, revenue: 740000 },
      { date: '20:00', price: 14500, sales: 88, revenue: 1276000 },
      { date: '24:00', price: 14500, sales: 45, revenue: 652500 },
    ],
    kpi: { winRate: '88.5%', winRateTrend: '+1.2%', revenue: '₩4,268,900', revenueTrend: '+5%', warnings: '12개', defenses: '324건', defenseText: '최근 24시간 동안 자동 대응' }
  },
  '7d': {
    salesCorrelation: [
      { date: '12.16', price: 15200, sales: 45, revenue: 684000 },
      { date: '12.17', price: 15100, sales: 48, revenue: 724800 },
      { date: '12.18', price: 15100, sales: 52, revenue: 785200 },
      { date: '12.19', price: 14800, sales: 85, revenue: 1258000 },
      { date: '12.20', price: 14800, sales: 92, revenue: 1361600 },
      { date: '12.21', price: 14900, sales: 88, revenue: 1311200 },
      { date: '12.22', price: 14500, sales: 120, revenue: 1740000 },
    ],
    kpi: { winRate: '85.2%', winRateTrend: '+4.5%', revenue: '₩42,500,000', revenueTrend: '+12%', warnings: '65개', defenses: '1,240건', defenseText: '최근 7일간 자동 대응' }
  },
  '30d': {
    salesCorrelation: [
      { date: '1주차', price: 15500, sales: 210, revenue: 3255000 },
      { date: '2주차', price: 15200, sales: 280, revenue: 4256000 },
      { date: '3주차', price: 14900, sales: 450, revenue: 6705000 },
      { date: '4주차', price: 14500, sales: 680, revenue: 9860000 },
    ],
    kpi: { winRate: '79.8%', winRateTrend: '+8.2%', revenue: '₩185,420,000', revenueTrend: '+25%', warnings: '142개', defenses: '5,600건', defenseText: '최근 30일간 자동 대응' }
  }
};

// 2. Competitor Market Share (누가 내 최저가를 위협하는가)
const competitorShareData = [
  { name: '쿠팡 (로켓)', value: 45, color: '#E11627' },
  { name: '네이버 스마트스토어', value: 30, color: '#03C75A' },
  { name: '11번가', value: 15, color: '#EF3125' },
  { name: 'G마켓/옥션', value: 10, color: '#022C72' },
];

// 3. Margin Distribution (마진율 구간별 상품 수)
const marginDistributionData = [
  { range: '초고마진 (30%↑)', count: 45 },
  { range: '안전마진 (15~30%)', count: 210 },
  { range: '경쟁심화 (5~15%)', count: 180 },
  { range: '위험구간 (5%↓)', count: 65 },
];

export function Dashboard() {
  const [period, setPeriod] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">분석 대시보드</h1>
          <p className="text-muted-foreground">가격 조정이 실제 매출과 순이익에 미치는 영향을 분석합니다.</p>
        </div>
        <div className="flex items-center gap-2 bg-background p-1 rounded-lg border">
          <Button 
            variant={period === '24h' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setPeriod('24h')}
            className="text-xs"
          >
            24시간
          </Button>
          <Button 
            variant={period === '7d' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setPeriod('7d')}
            className="text-xs"
          >
            최근 7일
          </Button>
          <Button 
            variant={period === '30d' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setPeriod('30d')}
            className="text-xs"
          >
            최근 30일
          </Button>
          <div className="w-[1px] h-4 bg-border mx-1"></div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최저가 점유율 (Win Rate)</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData[period as keyof typeof dashboardData].kpi.winRate}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              전 기간 대비 {dashboardData[period as keyof typeof dashboardData].kpi.winRateTrend} 상승
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">추정 매출액 (Revenue)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData[period as keyof typeof dashboardData].kpi.revenue}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              가격 최적화로 {dashboardData[period as keyof typeof dashboardData].kpi.revenueTrend} 증가
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">마진 경고 (Warning)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{dashboardData[period as keyof typeof dashboardData].kpi.warnings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              마진율 5% 미만 상품 주의
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">자동 방어 횟수</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData[period as keyof typeof dashboardData].kpi.defenses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData[period as keyof typeof dashboardData].kpi.defenseText}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <TabsList className="grid w-full grid-cols-3 min-w-[360px] lg:w-[400px]">
            <TabsTrigger value="performance">성과 분석</TabsTrigger>
            <TabsTrigger value="competitor">경쟁사 분석</TabsTrigger>
            <TabsTrigger value="profit">수익성 분석</TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Performance Analysis */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>가격 변동에 따른 판매량 상관관계</CardTitle>
              <CardDescription>
                <span className="text-primary font-bold">Insight:</span> 가격을 300원 인하했을 때, 판매량이 평균 40% 급증하여 총 매출은 오히려 상승했습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dashboardData[period as keyof typeof dashboardData].salesCorrelation}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs" 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      yAxisId="left" 
                      className="text-xs" 
                      tickLine={false} 
                      axisLine={false} 
                      label={{ value: '판매량 (개)', angle: -90, position: 'insideLeft', style: { fill: '#888', fontSize: 12 } }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      className="text-xs" 
                      tickLine={false} 
                      axisLine={false} 
                      domain={['auto', 'auto']}
                      label={{ value: '평균 판매가 (원)', angle: 90, position: 'insideRight', style: { fill: '#888', fontSize: 12 } }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                      labelStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="sales" 
                      name="판매량 (Sales)" 
                      fill="url(#colorSales)" 
                      stroke="var(--primary)" 
                    />
                    <Line 
                      yAxisId="right"
                      type="stepAfter" 
                      dataKey="price" 
                      name="내 판매가 (Price)" 
                      stroke="#ff7300" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Competitor Analysis */}
        <TabsContent value="competitor" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>경쟁사별 최저가 위협 비율</CardTitle>
                <CardDescription>어떤 마켓이 우리 상품의 최저가를 가장 자주 갱신하는가?</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="h-[300px] w-full min-w-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={competitorShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {competitorShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, '점유율']}
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>주요 타겟 경쟁몰</CardTitle>
                <CardDescription>집중 견제 대상 리스트</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: '쿠팡 (직매입)', threat: '높음', count: 142, trend: 'up' },
                    { name: '스마트스토어 A샵', threat: '중간', count: 45, trend: 'down' },
                    { name: '11번가 B몰', threat: '중간', count: 32, trend: 'stable' },
                    { name: '롯데온', threat: '낮음', count: 12, trend: 'stable' },
                  ].map((comp, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{comp.name}</span>
                        <span className="text-xs text-muted-foreground">경합 상품 {comp.count}개</span>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "text-xs font-bold px-2 py-1 rounded-full",
                          comp.threat === '높음' ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                        )}>
                          위협도 {comp.threat}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Profit Analysis */}
        <TabsContent value="profit" className="space-y-4">
           <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>마진율 구간별 상품 분포</CardTitle>
                <CardDescription>현재 운용 중인 상품들의 수익성 건전도</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marginDistributionData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="range" type="category" width={100} className="text-xs font-medium" />
                      <Tooltip cursor={{fill: 'var(--muted)'}} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                      <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={32} name="상품 수" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Action Items (수익성 개선 제안)</CardTitle>
                <CardDescription>시스템이 분석한 즉시 실행 가능한 조치</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                   <div className="p-4 border border-l-4 border-l-green-500 rounded-md bg-green-500/5">
                    <h4 className="font-bold text-sm flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                      가격 인상 기회 (12개 상품)
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      경쟁사가 품절되었거나 가격을 올렸습니다. 마진 확보를 위해 500원 인상을 제안합니다.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">대상 상품 보기</Button>
                   </div>

                   <div className="p-4 border border-l-4 border-l-red-500 rounded-md bg-red-500/5">
                    <h4 className="font-bold text-sm flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                      출혈 경쟁 중단 권고 (5개 상품)
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      지난 3일간 마진율이 3% 미만으로 유지되고 있습니다. 모니터링을 일시 중지하여 손실을 방지하세요.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">설정 변경하기</Button>
                   </div>
                </div>
              </CardContent>
            </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
