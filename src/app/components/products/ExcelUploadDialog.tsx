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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Upload, FileSpreadsheet, Download, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface ExcelUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExcelUploadDialog({ open, onOpenChange }: ExcelUploadDialogProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handleUpload = () => {
    setUploadState('uploading');
    setTimeout(() => {
      setUploadState('success');
    }, 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setUploadState('idle');
      setActiveTab('upload');
    }, 300);
  };

  const handleDownloadTemplate = () => {
    // CSV Content with BOM for Excel Korean support
    const bom = '\uFEFF';
    const headers = ['상품ID', '상품명', '매입원가', '최소마진율', '경쟁사URL', '전략코드'];
    const exampleRow = ['101', '[쿠팡] 삼성전자 갤럭시 S24', '', '15', 'https://search.shopping.naver.com/...', 'MIN_100'];
    
    const csvContent = bom + [
      headers.join(','),
      exampleRow.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'priceguard_template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>엑셀 일괄 작업</DialogTitle>
          <DialogDescription>
            대량의 상품 정보를 엑셀로 한 번에 업데이트하거나 양식을 확인합니다.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">파일 업로드</TabsTrigger>
            <TabsTrigger value="template">양식 미리보기 (가이드)</TabsTrigger>
          </TabsList>

          {/* 업로드 탭 */}
          <TabsContent value="upload" className="space-y-4 py-4">
            {uploadState === 'idle' && (
              <div 
                className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={handleUpload}
              >
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">엑셀 파일 업로드</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  파일을 여기로 드래그하거나 클릭하여 선택하세요.<br/>
                  <span className="text-xs">(.xlsx, .csv 형식 지원)</span>
                </p>
                <Button variant="outline" size="sm">파일 선택하기</Button>
              </div>
            )}

            {uploadState === 'uploading' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">데이터 분석 및 검증 중...</p>
              </div>
            )}

            {uploadState === 'success' && (
              <div className="py-6 text-center space-y-4">
                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-xl">업로드 완료</h3>
                <p className="text-muted-foreground">총 120개 상품의 정보가 업데이트되었습니다.</p>
                <div className="bg-slate-50 p-4 rounded text-sm text-left mx-auto max-w-md border">
                  <div className="flex justify-between py-1 border-b">
                    <span>원가 수정:</span>
                    <span className="font-bold">50건</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>경쟁사 URL 추가:</span>
                    <span className="font-bold">65건</span>
                  </div>
                  <div className="flex justify-between py-1 text-red-600">
                    <span>실패 (형식오류):</span>
                    <span className="font-bold">5건</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 text-blue-900 p-4 rounded-md flex gap-3 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">엑셀 업로드 Tip</p>
                <p>
                  1. 먼저 [마켓 동기화]를 진행하여 상품 리스트를 생성하세요.<br/>
                  2. [양식 다운로드] 후 비어있는 '원가'와 '경쟁사 URL' 열만 채워서 업로드하면 됩니다.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* 양식 가이드 탭 */}
          <TabsContent value="template" className="space-y-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-lg">엑셀 양식 구조</h3>
                <p className="text-sm text-muted-foreground">아래 표의 헤더 이름대로 작성되어야 시스템이 인식합니다.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" /> 빈 양식 파일 다운로드
              </Button>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="w-[120px]">열 (Column)</TableHead>
                    <TableHead className="w-[150px]">헤더명 (Header)</TableHead>
                    <TableHead className="w-[100px]">필수 여부</TableHead>
                    <TableHead>설명 및 예시</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono bg-slate-50">A</TableCell>
                    <TableCell className="font-bold">상품ID</TableCell>
                    <TableCell><span className="text-red-500 font-bold">필수</span></TableCell>
                    <TableCell className="text-sm">
                      시스템이 상품을 식별하는 고유 ID입니다. <br/>
                      <span className="text-muted-foreground text-xs">(마켓 동기화 후 다운로드한 엑셀에 자동 기입되어 있습니다. 수정 금지)</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono bg-slate-50">B</TableCell>
                    <TableCell className="font-bold">상품명</TableCell>
                    <TableCell className="text-muted-foreground">참고용</TableCell>
                    <TableCell className="text-sm">확인용 상품명입니다. 수정해도 시스템에 반영되지 않습니다.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono bg-slate-50">C</TableCell>
                    <TableCell className="font-bold text-blue-600">매입원가</TableCell>
                    <TableCell><span className="text-red-500 font-bold">필수</span></TableCell>
                    <TableCell className="text-sm">
                      숫자만 입력 (예: <code className="bg-muted px-1 rounded">15000</code>). 마진 계산의 기준이 됩니다.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono bg-slate-50">D</TableCell>
                    <TableCell className="font-bold text-blue-600">최소마진율</TableCell>
                    <TableCell><span className="text-muted-foreground">선택</span></TableCell>
                    <TableCell className="text-sm">
                      % 단위 입력 (예: <code className="bg-muted px-1 rounded">15</code>). 미입력 시 기본값 10% 적용.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono bg-slate-50">E</TableCell>
                    <TableCell className="font-bold text-blue-600">경쟁사URL</TableCell>
                    <TableCell><span className="text-red-500 font-bold">필수</span></TableCell>
                    <TableCell className="text-sm">
                      네이버 가격비교 또는 경쟁사 상품 URL.<br/>
                      <span className="text-xs text-muted-foreground">여러 개일 경우 콤마(,)로 구분</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono bg-slate-50">F</TableCell>
                    <TableCell className="font-bold text-blue-600">전략코드</TableCell>
                    <TableCell><span className="text-muted-foreground">선택</span></TableCell>
                    <TableCell className="text-sm">
                      <code className="bg-muted px-1 rounded">MIN_100</code> (최저가-100원), 
                      <code className="bg-muted px-1 rounded">SAME</code> (동일가), 
                      <code className="bg-muted px-1 rounded">2ND</code> (2등전략)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={handleClose}>닫기</Button>
          {activeTab === 'upload' && uploadState === 'idle' && (
             <Button variant="secondary" onClick={() => setActiveTab('template')}>
               <FileText className="mr-2 h-4 w-4" /> 양식 먼저 보기
             </Button>
          )}
          {activeTab === 'upload' && uploadState === 'success' && (
             <Button onClick={handleClose}>완료</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
