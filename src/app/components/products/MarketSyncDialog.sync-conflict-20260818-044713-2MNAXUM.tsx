import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from '../ui/progress';

export interface MarketProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  market: 'coupang' | 'naver';
}

interface MarketSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSyncComplete: (products: MarketProduct[]) => void;
}

export function MarketSyncDialog({ open, onOpenChange, onSyncComplete }: MarketSyncDialogProps) {
  const [step, setStep] = useState<'select' | 'fetching' | 'selection' | 'complete'>('select');
  const [progress, setProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Mock data for fetched products
  const fetchedProducts: MarketProduct[] = [
    { id: 101, name: '[쿠팡] 삼성전자 갤럭시 S24 울트라 256GB', price: 1698000, image: '📱', market: 'coupang' },
    { id: 102, name: '[쿠팡] 신라면 120g x 5개입', price: 3900, image: '🍜', market: 'coupang' },
    { id: 103, name: '[네이버] 나이키 에어포스 1 07', price: 139000, image: '👟', market: 'naver' },
    { id: 104, name: '[네이버] 맥북 에어 15 M2', price: 1890000, image: '💻', market: 'naver' },
    { id: 105, name: '[쿠팡] 코카콜라 제로 355ml x 24캔', price: 21900, image: '🥤', market: 'coupang' },
    { id: 106, name: '[네이버] 다이슨 에어랩 멀티 스타일러', price: 699000, image: '💇‍♀️', market: 'naver' },
  ];

  // Initialize selected items when fetching is done
  React.useEffect(() => {
    if (step === 'selection') {
      setSelectedItems(fetchedProducts.map(p => p.id));
    }
  }, [step]);

  const startSync = () => {
    setStep('fetching');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('selection'); // Go to selection step instead of complete
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const toggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === fetchedProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(fetchedProducts.map(p => p.id));
    }
  };

  const confirmSelection = () => {
    setStep('complete');
    // Filter selected products and pass them back to parent
    const selectedProducts = fetchedProducts.filter(p => selectedItems.includes(p.id));
    // Add a small delay to simulate processing before updating parent
    setTimeout(() => {
      onSyncComplete(selectedProducts);
    }, 500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep('select');
      setProgress(0);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>마켓 상품 동기화</DialogTitle>
          <DialogDescription>
            연동된 마켓에서 판매 중인 상품 정보를 가져옵니다.
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="py-4 space-y-4">
            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox id="coupang" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="coupang" className="font-semibold text-base">쿠팡 (Coupang)</Label>
                <p className="text-sm text-muted-foreground">Wing 판매자 센터 상품 가져오기</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox id="naver" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="naver" className="font-semibold text-base">네이버 스마트스토어</Label>
                <p className="text-sm text-muted-foreground">스토어센터 상품 가져오기</p>
              </div>
            </div>
            <div className="bg-amber-50 p-3 rounded-md text-amber-900 text-sm flex gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">주의사항</p>
                <p>상품명, 판매가, 옵션, 이미지만 가져옵니다.<br/>원가와 경쟁사 URL은 동기화 후 엑셀로 입력해야 합니다.</p>
              </div>
            </div>
          </div>
        )}

        {step === 'fetching' && (
          <div className="py-8 space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">마켓에서 상품 정보를 읽어오는 중...</h3>
              <p className="text-sm text-muted-foreground">잠시만 기다려주세요. ({progress}%)</p>
            </div>
            <Progress value={progress} className="w-full h-2" />
            <div className="text-xs text-muted-foreground text-left space-y-1 bg-muted p-3 rounded">
              <p>• 쿠팡 API 연결... OK</p>
              <p>• 스마트스토어 API 연결... OK</p>
              <p>• 상품 리스트 수신 중...</p>
            </div>
          </div>
        )}

        {step === 'selection' && (
          <div className="py-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">등록할 상품 선택</h3>
                <p className="text-sm text-muted-foreground">
                  총 {fetchedProducts.length}개 중 <span className="text-primary font-bold">{selectedItems.length}개</span> 선택됨
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={toggleAll}>
                {selectedItems.length === fetchedProducts.length ? '전체 해제' : '전체 선택'}
              </Button>
            </div>

            <div className="border rounded-md h-[300px] overflow-y-auto">
              <div className="divide-y">
                {fetchedProducts.map((product) => (
                  <div key={product.id} className="flex items-center p-3 hover:bg-muted/50 transition-colors">
                    <Checkbox 
                      id={`p-${product.id}`} 
                      checked={selectedItems.includes(product.id)}
                      onCheckedChange={() => toggleItem(product.id)}
                      className="mr-3"
                    />
                    <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center text-lg mr-3">
                      {product.image}
                    </div>
                    <label htmlFor={`p-${product.id}`} className="flex-1 cursor-pointer grid gap-0.5">
                      <span className="font-medium text-sm truncate">{product.name}</span>
                      <span className="text-xs text-muted-foreground">{product.price.toLocaleString()}원</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 text-blue-900 p-3 rounded-md text-xs flex gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>선택하지 않은 상품은 시스템에 등록되지 않으며, 가격 관리 대상에서 제외됩니다.</p>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="py-6 text-center space-y-4">
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">동기화 완료!</h3>
              <p className="text-muted-foreground">
                선택하신 <span className="text-foreground font-bold">{selectedItems.length}개</span>의 상품을 성공적으로 가져왔습니다.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-sm text-left">
              <p className="font-semibold mb-2">다음 할 일:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>엑셀 다운로드 메뉴에서 '빈 양식' 다운로드</li>
                <li>원가(Cost) 및 경쟁사 URL 입력</li>
                <li>엑셀 일괄 업로드로 정보 업데이트</li>
              </ul>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'select' && (
            <>
              <Button variant="outline" onClick={handleClose}>취소</Button>
              <Button onClick={startSync}>동기화 시작</Button>
            </>
          )}
          {step === 'fetching' && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 목록 가져오는 중
            </Button>
          )}
          {step === 'selection' && (
            <>
              <div className="flex-1 text-xs text-muted-foreground text-left">
                * 체크박스 해제 시 목록에서 제외됨
              </div>
              <Button variant="outline" onClick={() => setStep('select')}>이전</Button>
              <Button onClick={confirmSelection} disabled={selectedItems.length === 0}>
                선택 완료 ({selectedItems.length})
              </Button>
            </>
          )}
          {step === 'complete' && (
            <Button onClick={handleClose}>확인</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
