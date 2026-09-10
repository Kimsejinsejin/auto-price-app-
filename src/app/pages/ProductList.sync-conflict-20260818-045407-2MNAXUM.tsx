import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { 
  Search, 
  Plus, 
  Filter, 
  ExternalLink, 
  MoreHorizontal, 
  Download, 
  Upload, 
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { MarketSyncDialog, MarketProduct } from '../components/products/MarketSyncDialog';
import { ExcelUploadDialog } from '../components/products/ExcelUploadDialog';

// Mock Data Initial State
const initialProducts = [
  { id: 1, name: '삼성 갤럭시 S24 울트라', myPrice: 1540000, compPrice: 1540100, minPrice: 1400000, status: 'winning', lastCheck: '5분 전', channel: '쿠팡' },
  { id: 2, name: '애플 에어팟 프로 2세대', myPrice: 329000, compPrice: 325000, minPrice: 329000, status: 'losing_limit', lastCheck: '12분 전', channel: '스마트스토어' },
  { id: 3, name: '소니 WH-1000XM5 헤드폰', myPrice: 419000, compPrice: 429000, minPrice: 390000, status: 'winning', lastCheck: '2분 전', channel: '쿠팡' },
  { id: 4, name: '로지텍 MX Master 3S', myPrice: 129000, compPrice: 129100, minPrice: 110000, status: 'winning', lastCheck: '30분 전', channel: '11번가' },
  { id: 5, name: '닌텐도 스위치 OLED', myPrice: 395000, compPrice: 380000, minPrice: 395000, status: 'losing_limit', lastCheck: '1시간 전', channel: '쿠팡' },
];

export function ProductList() {
  const navigate = useNavigate();
  const [syncDialogOpen, setSyncDialogOpen] = React.useState(false);
  const [excelDialogOpen, setExcelDialogOpen] = React.useState(false);
  const [products, setProducts] = React.useState(initialProducts);

  const handleSyncComplete = (newMarketProducts: MarketProduct[]) => {
    // Convert MarketProduct to the main product format and add to list
    const newItems = newMarketProducts.map(mp => ({
      id: Date.now() + mp.id, // Generate unique ID
      name: mp.name,
      myPrice: mp.price,
      compPrice: 0,
      minPrice: 0, // Default for new synced items (needs setup)
      status: 'pending', // New status for setup required
      lastCheck: '방금 전',
      channel: mp.market === 'coupang' ? '쿠팡' : '스마트스토어'
    }));
    
    setProducts(prev => [...newItems, ...prev]);
  };

  return (
    <div className="space-y-6">
      <MarketSyncDialog 
        open={syncDialogOpen} 
        onOpenChange={setSyncDialogOpen} 
        onSyncComplete={handleSyncComplete}
      />
      <ExcelUploadDialog open={excelDialogOpen} onOpenChange={setExcelDialogOpen} />

      {/* 상단 헤더 및 액션 버튼 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">상품 관리</h1>
          <p className="text-muted-foreground">총 500개 상품 중 <span className="text-green-600 font-bold">425개</span>가 최저가 우위입니다.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* 대량 작업용 버튼 그룹 */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border">
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setSyncDialogOpen(true)}>
              <RefreshCw className="mr-2 h-3 w-3" />
              마켓 동기화
            </Button>
            <div className="w-[1px] h-4 bg-border mx-1"></div>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setExcelDialogOpen(true)}>
              <FileSpreadsheet className="mr-2 h-3 w-3" />
              엑셀 일괄등록
            </Button>
            <div className="w-[1px] h-4 bg-border mx-1"></div>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => {
              setExcelDialogOpen(true);
              // Open excel dialog and ideally switch to template tab automatically, 
              // but for now the user can click the tab. 
              // In a real app we would pass an initialTab prop.
            }}>
              <Download className="mr-2 h-3 w-3" />
              양식 다운로드
            </Button>
          </div>
          
          <Button onClick={() => navigate('/products/new')} className="ml-2">
            <Plus className="mr-2 h-4 w-4" /> 개별 등록
          </Button>
        </div>
      </div>

      {/* 필터 및 검색 바 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>전체 상품 목록</CardTitle>
            <div className="flex items-center gap-2">
               <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="상품명, SKU 검색..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"><Input type="checkbox" className="h-4 w-4" /></TableHead>
                <TableHead className="w-[300px]">상품명 / 마켓</TableHead>
                <TableHead>내 가격</TableHead>
                <TableHead>경쟁사 최저가</TableHead>
                <TableHead>마진 하한가</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>최근 확인</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell><Input type="checkbox" className="h-4 w-4" /></TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="truncate">{product.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] py-0 h-5 font-normal text-muted-foreground">
                          {product.channel}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-normal">SKU: {1000 + product.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{product.myPrice.toLocaleString()}원</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {product.compPrice.toLocaleString()}원
                      <a href="#" className="text-blue-500 hover:underline">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.minPrice.toLocaleString()}원</TableCell>
                  <TableCell>
                    {product.status === 'winning' && (
                      <Badge variant="success" className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20">
                        최저가 점유
                      </Badge>
                    )}
                    {product.status === 'losing_limit' && (
                      <Badge variant="warning" className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/20">
                        마진 제한
                      </Badge>
                    )}
                    {product.status === 'tie' && (
                      <Badge variant="secondary">
                        동일가
                      </Badge>
                    )}
                    {product.status === 'pending' && (
                      <Badge variant="outline" className="text-muted-foreground border-dashed">
                        설정 필요
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{product.lastCheck}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>작업 선택</DropdownMenuLabel>
                        <DropdownMenuItem>가격 수정 내역</DropdownMenuItem>
                        <DropdownMenuItem>경쟁사 URL 변경</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">모니터링 중지</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              선택된 상품 0개
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>선택 상품 전략 일괄 변경</Button>
              <Button variant="outline" size="sm" disabled>선택 삭제</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
