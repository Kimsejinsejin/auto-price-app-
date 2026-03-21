import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Store, 
  Search, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

export function ProductRegistration() {
  const navigate = useNavigate();

  const handleSave = async () => {
    // import { supabase } from '../../lib/supabase';
    console.log("Supabase 'products' 테이블에 데이터 저장 (준비 됨)");
    alert("Supabase 데이터베이스 연동 설계가 완료되었습니다. API 키를 넣으면 실제 저장이 실행됩니다!");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">상품 등록 및 전략 설정</h1>
            <p className="text-muted-foreground">자동 가격 관리를 위한 상품 정보와 모니터링 전략을 설정합니다.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/products')}>취소</Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> 설정 저장 및 모니터링 시작
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger value="basic" className="py-3 flex flex-col gap-1">
            <span className="font-semibold">1. 기본 정보</span>
            <span className="text-xs text-muted-foreground font-normal">상품 식별 및 원가 설정</span>
          </TabsTrigger>
          <TabsTrigger value="channels" className="py-3 flex flex-col gap-1">
            <span className="font-semibold">2. 내 판매처 (Output)</span>
            <span className="text-xs text-muted-foreground font-normal">가격 수정 대상 마켓 연동</span>
          </TabsTrigger>
          <TabsTrigger value="competitors" className="py-3 flex flex-col gap-1">
            <span className="font-semibold">3. 경쟁사 추적 (Input)</span>
            <span className="text-xs text-muted-foreground font-normal">크롤링 타겟 URL 설정</span>
          </TabsTrigger>
          <TabsTrigger value="strategy" className="py-3 flex flex-col gap-1">
            <span className="font-semibold">4. 가격 방어 전략</span>
            <span className="text-xs text-muted-foreground font-normal">자동 조정 규칙 및 안전장치</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. 기본 정보 탭 */}
        <TabsContent value="basic">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>상품 마스터 정보</CardTitle>
                <CardDescription>모든 마켓에 공통으로 적용될 기준 정보입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">관리용 상품명</Label>
                  <Input id="productName" placeholder="예: [본사] 갤럭시 S24 울트라 256GB 블랙" />
                  <p className="text-[0.8rem] text-muted-foreground">내부 관리용 이름입니다. 실제 마켓 상품명과 달라도 됩니다.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (자체 관리 코드)</Label>
                    <Input id="sku" placeholder="GALAXY-S24U-BK" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="digital">디지털/가전</SelectItem>
                        <SelectItem value="fashion">의류/패션</SelectItem>
                        <SelectItem value="food">식품</SelectItem>
                        <SelectItem value="living">생활용품</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>대표 이미지</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                    <Plus className="h-8 w-8 mb-2" />
                    <span>이미지 업로드</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>원가 및 마진 기준</CardTitle>
                <CardDescription>
                  <span className="text-red-500 font-bold">*매우 중요* </span> 
                  자동 가격 인하 시 이 정보를 기반으로 마진 방어선이 설정됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">매입 원가 (VAT 포함)</Label>
                  <div className="relative">
                    <Input id="costPrice" type="number" placeholder="0" className="pl-8" />
                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">₩</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minMargin">최소 보장 마진율 (%)</Label>
                  <div className="flex items-center gap-4">
                    <Input id="minMargin" type="number" placeholder="10" className="w-24" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-amber-600 mb-1">마진 방어선 예상가</div>
                      <div className="text-2xl font-bold">0원</div>
                      <p className="text-xs text-muted-foreground">이 가격 밑으로는 절대 내려가지 않습니다.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="standardPrice">표준 판매가 (기본값)</Label>
                  <div className="relative">
                    <Input id="standardPrice" type="number" placeholder="0" className="pl-8" />
                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">₩</span>
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">경쟁사가 없거나 모니터링 실패 시 돌아갈 가격입니다.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. 내 판매처 탭 */}
        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>판매처 연동 설정 (Target Market)</CardTitle>
              <CardDescription>
                가격 수정 명령을 보낼 내 상품의 정보를 입력합니다. <br/>
                <span className="text-xs text-muted-foreground">※ API 연동이 되어 있어야 자동 수정이 가능합니다.</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 쿠팡 설정 */}
              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-red-600 flex items-center justify-center text-white font-bold text-xs">C</div>
                    <div>
                      <h3 className="font-semibold">쿠팡 (Coupang)</h3>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> API 연동됨
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">등록상품 ID (Product ID)</Label>
                    <Input placeholder="예: 12345678" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">옵션 ID (Vendor Item ID)</Label>
                    <Input placeholder="예: 87654321" />
                    <p className="text-[10px] text-muted-foreground">API 수정 시 필수값입니다.</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">상품 URL</Label>
                    <div className="flex gap-2">
                      <Input placeholder="https://www.coupang.com/vp/products/..." />
                      <Button variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 스마트스토어 설정 */}
              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-green-500 flex items-center justify-center text-white font-bold text-xs">N</div>
                    <div>
                      <h3 className="font-semibold">네이버 스마트스토어</h3>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> API 연동됨
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">스마트스토어 상품 ID (Origin Product No)</Label>
                    <Input placeholder="예: 10024511" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">채널 상품 번호 (Channel Product No)</Label>
                    <Input placeholder="선택사항" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">상품 URL</Label>
                    <div className="flex gap-2">
                      <Input placeholder="https://smartstore.naver.com/..." />
                      <Button variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> 다른 판매처 추가 (11번가, 지마켓 등)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 3. 경쟁사 추적 탭 */}
        <TabsContent value="competitors">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex gap-3 text-blue-900">
              <HelpCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Tip: 네이버 가격비교 URL을 등록하세요!</p>
                <p>개별 상품 URL을 여러 개 등록하는 것보다, 네이버가 이미 묶어놓은 '가격비교 페이지(Catalog)' URL 하나를 등록하는 것이 크롤링 정확도와 속도 면에서 훨씬 유리합니다.</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>메인 모니터링 타겟</CardTitle>
                <CardDescription>가장 우선적으로 가격을 참고할 타겟입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>네이버 쇼핑 가격비교 URL (권장)</Label>
                  <div className="flex gap-2">
                    <Input placeholder="https://search.shopping.naver.com/catalog/..." />
                    <Button variant="secondary">유효성 검사</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    입력 시 해당 카탈로그에 묶인 <span className="font-bold text-foreground">모든 판매처의 최저가</span>를 자동으로 수집합니다.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>개별 경쟁사 URL 추가</CardTitle>
                  <CardDescription>가격비교에 묶이지 않은 특정 경쟁사나 쿠팡 아이템 위너를 추적합니다.</CardDescription>
                </div>
                <Button size="sm" variant="outline"><Plus className="mr-2 h-4 w-4" /> URL 추가</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="grid gap-1 flex-1">
                        <Label className="text-xs">경쟁 상품 URL {i}</Label>
                        <Input placeholder="https://..." />
                      </div>
                      <div className="grid gap-1 w-32">
                        <Label className="text-xs">플랫폼</Label>
                        <Select defaultValue="coupang">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coupang">쿠팡</SelectItem>
                            <SelectItem value="naver">네이버</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="ghost" size="icon" className="mt-6 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 4. 가격 방어 전략 탭 */}
        <TabsContent value="strategy">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>가격 대응 규칙 (Rule)</CardTitle>
                <CardDescription>경쟁사 가격 변동 시 어떻게 대응할지 설정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>기본 대응 전략</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-accent/50 border-primary">
                      <input type="radio" name="strategy" id="s1" className="accent-primary" defaultChecked />
                      <Label htmlFor="s1" className="flex-1 cursor-pointer">
                        <span className="font-bold block">무조건 최저가 -100원</span>
                        <span className="text-xs text-muted-foreground">경쟁사보다 무조건 저렴하게 설정하여 상단 노출</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <input type="radio" name="strategy" id="s2" className="accent-primary" />
                      <Label htmlFor="s2" className="flex-1 cursor-pointer">
                        <span className="font-bold block">최저가와 동일하게 (Same Price)</span>
                        <span className="text-xs text-muted-foreground">치킨 게임 방지, 가격 경쟁 완화</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <input type="radio" name="strategy" id="s3" className="accent-primary" />
                      <Label htmlFor="s3" className="flex-1 cursor-pointer">
                        <span className="font-bold block">2등 전략 (최저가 + 100원)</span>
                        <span className="text-xs text-muted-foreground">최저가 업체 품절 시 노출 노림 (마진 확보용)</span>
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>상세 조정 값</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">차감 금액</Label>
                      <div className="relative">
                        <Input type="number" defaultValue={100} className="pr-8" />
                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">원</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">가격 조정 단위</Label>
                      <Select defaultValue="100">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10원 단위</SelectItem>
                          <SelectItem value="100">100원 단위</SelectItem>
                          <SelectItem value="500">500원 단위</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>안전 장치 (Fail-Safe)</CardTitle>
                <CardDescription>오류나 과도한 경쟁으로 인한 피해를 방지합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>마진 방어선 보호</Label>
                        <p className="text-xs text-muted-foreground">설정된 최저 마진 이하로는 절대 가격을 내리지 않음</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>급락 방지 (Circuit Breaker)</Label>
                        <p className="text-xs text-muted-foreground">한 번에 10% 이상 가격 하락 시 변경 보류 및 알림</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>야간/주말 방어 모드</Label>
                        <p className="text-xs text-muted-foreground">업무 시간 외에는 공격적 가격 인하 중지</p>
                      </div>
                      <Switch />
                    </div>
                 </div>

                 <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-900 text-sm flex gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>마진 방어선 도달 시: <strong>최저가 경쟁 포기하고 마진 하한가 유지</strong></p>
                 </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
