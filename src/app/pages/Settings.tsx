import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Shield, Key, RefreshCw, Save, Bell, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';
import { Switch } from '../components/ui/switch';

export function Settings() {
  const [activeTab, setActiveTab] = React.useState('general');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">환경 설정</h1>
        <p className="text-muted-foreground">가격 모니터링 규칙과 마켓 연동 정보를 설정합니다.</p>
      </div>

      <div className="w-full">
        <div className="flex w-full border-b bg-background mb-6">
          <button
            onClick={() => setActiveTab('general')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px hover:text-foreground",
              activeTab === 'general' ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            )}
          >
            기본 전략 설정
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px hover:text-foreground",
              activeTab === 'api' ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            )}
          >
            API 연동 관리
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px hover:text-foreground",
              activeTab === 'notifications' ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            )}
          >
            알림 설정
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>가격 결정 규칙</CardTitle>
                </div>
                <CardDescription>
                  경쟁사 가격 변동 시 대응할 기본 알고리즘을 설정합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="undercut" className="text-base font-semibold">기본 차감액 (원)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="undercut" defaultValue="100" type="number" className="w-[120px]" />
                    <span className="text-sm text-muted-foreground">원 더 저렴하게 설정</span>
                  </div>
                  <p className="text-xs text-muted-foreground">경쟁사 최저가보다 항상 이 금액만큼 낮게 유지합니다. (최소 10원 단위)</p>
                </div>
                
                <div className="border-t pt-4 grid gap-3">
                  <Label htmlFor="safety" className="text-base font-semibold flex items-center gap-2">
                    안전 차단율 (Safety Breaker)
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input id="safety" defaultValue="10" type="number" className="w-[120px]" />
                    <span className="text-sm text-muted-foreground">% 이상 하락 시 변경 중단</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    오류나 공격적인 경쟁으로 인해 가격이 급격히 떨어지는 것을 방지합니다.<br/>
                    예: 10% 설정 시, 기존가 10,000원에서 9,000원 미만으로 변경 시도 시 차단됨.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-muted/20">
                <Button>
                  <Save className="mr-2 h-4 w-4" /> 설정 저장하기
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  <CardTitle>마켓 API 키 관리</CardTitle>
                </div>
                <CardDescription>
                  자동 가격 조정을 위해 각 마켓 판매자 센터의 API 키를 입력하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 rounded-lg border p-5 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center text-lg">
                      쿠팡 (Coupang Wing)
                    </h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">미연동</span>
                  </div>
                  <div className="grid gap-2">
                    <Label>Vendor ID</Label>
                    <Input placeholder="Coupang Vendor ID 입력" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Access Key</Label>
                    <Input type="password" placeholder="Access Key 입력" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Secret Key</Label>
                    <Input type="password" placeholder="Secret Key 입력" />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-2">
                    쿠팡 연동하기
                  </Button>
                </div>

                <div className="space-y-4 rounded-lg border p-5">
                  <div className="flex items-center justify-between">
                     <h3 className="font-semibold flex items-center text-lg">
                      네이버 스마트스토어
                    </h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">미연동</span>
                  </div>
                  <div className="grid gap-2">
                    <Label>Application ID (Client ID)</Label>
                    <Input placeholder="네이버 커머스API 센터에서 발급받은 ID 입력" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Secret Key</Label>
                    <Input type="password" placeholder="Secret Key 입력" />
                  </div>
                  <Button className="w-full bg-[#03C75A] hover:bg-[#02b351] text-white">
                    네이버 스마트스토어 연동하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
           <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>알림 설정</CardTitle>
                </div>
                <CardDescription>
                  중요한 가격 변동이나 이슈 발생 시 알림을 받을 채널을 설정합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="noti-price" className="flex flex-col space-y-1">
                    <span>최저가 뺏김 알림</span>
                    <span className="font-normal text-xs text-muted-foreground">내 상품이 최저가 지위를 잃었을 때 즉시 알림</span>
                  </Label>
                  <Switch id="noti-price" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="noti-margin" className="flex flex-col space-y-1">
                    <span>마진 방어선 도달 알림</span>
                    <span className="font-normal text-xs text-muted-foreground">설정한 최저 마진율에 도달하여 가격 인하가 멈췄을 때</span>
                  </Label>
                  <Switch id="noti-margin" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="noti-error" className="flex flex-col space-y-1">
                    <span>API 연동 오류 알림</span>
                    <span className="font-normal text-xs text-muted-foreground">마켓 API 키 만료나 통신 오류 발생 시</span>
                  </Label>
                  <Switch id="noti-error" defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-muted/20">
                <Button>설정 저장하기</Button>
              </CardFooter>
            </Card>
           </div>
        )}
      </div>
    </div>
  );
}
