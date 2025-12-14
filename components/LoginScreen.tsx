import React, { useState, useEffect } from 'react';
import { Eye, ArrowRight, Lock, Phone, UserPlus, LogIn, AlertCircle, KeyRound } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 清除错误信息当模式切换时
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
  }, [mode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (!phone || !password) {
        throw new Error('请填写所有必填字段');
      }

      // 简单的手机号格式校验
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
         throw new Error('请输入有效的11位手机号码');
      }

      // 模拟数据库：从 LocalStorage 获取用户数据
      const usersRaw = localStorage.getItem('ocula_users');
      const users = usersRaw ? JSON.parse(usersRaw) : {};

      if (mode === 'register') {
        // --- 注册逻辑 ---
        if (users[phone]) {
          throw new Error('该手机号已被注册');
        }
        if (password.length < 6) {
          throw new Error('密码长度至少需要6位');
        }
        if (password !== confirmPassword) {
          throw new Error('两次输入的密码不一致');
        }

        // 保存新用户
        users[phone] = { password, createdAt: new Date().toISOString() };
        localStorage.setItem('ocula_users', JSON.stringify(users));
        
        setSuccessMsg('注册成功！请登录');
        setTimeout(() => setMode('login'), 1500);

      } else if (mode === 'forgot') {
        // --- 找回密码逻辑 ---
        if (!users[phone]) {
          throw new Error('该手机号未注册');
        }
        if (password.length < 6) {
          throw new Error('新密码长度至少需要6位');
        }
        if (password !== confirmPassword) {
          throw new Error('两次输入的密码不一致');
        }

        // 更新密码
        users[phone].password = password;
        localStorage.setItem('ocula_users', JSON.stringify(users));

        setSuccessMsg('密码重置成功！请使用新密码登录');
        setTimeout(() => setMode('login'), 1500);

      } else {
        // --- 登录逻辑 ---
        const user = users[phone];
        if (!user) {
          throw new Error('该账号不存在，请先注册');
        }
        if (user.password !== password) {
          throw new Error('密码错误');
        }

        // 登录成功
        onLogin();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderStyle = () => {
    switch (mode) {
      case 'register': return 'bg-gradient-to-r from-indigo-600 to-purple-600';
      case 'forgot': return 'bg-gradient-to-r from-slate-600 to-slate-800';
      default: return 'bg-gradient-to-r from-blue-600 to-indigo-600';
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'register': return '创建您的专业账号';
      case 'forgot': return '重置账号密码';
      default: return '专业眼部健康监测平台';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
        
        {/* Header */}
        <div className={`p-8 text-center transition-colors duration-500 ${getHeaderStyle()}`}>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            {mode === 'forgot' ? (
              <KeyRound className="text-white w-8 h-8" />
            ) : (
              <Eye className="text-white w-8 h-8" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Ocula Analysis</h1>
          <p className="text-blue-100 text-sm">
            {getTitle()}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-5">
            
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">手机号码</label>
              <div className="relative group">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none bg-slate-50 focus:bg-white"
                  placeholder="请输入11位手机号"
                  maxLength={11}
                />
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>
            
            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  {mode === 'forgot' ? '新密码' : '密码'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    忘记密码？
                  </button>
                )}
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none bg-slate-50 focus:bg-white"
                  placeholder={mode === 'register' ? "设置6位以上密码" : (mode === 'forgot' ? "设置新密码" : "请输入密码")}
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Confirm Password (Register or Forgot) */}
            {(mode === 'register' || mode === 'forgot') && (
              <div className="animate-fade-in-down">
                <label className="block text-sm font-medium text-slate-700 mb-2">确认密码</label>
                <div className="relative group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors outline-none bg-slate-50 focus:bg-white"
                    placeholder="再次输入密码"
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100">
                <UserPlus className="w-4 h-4" />
                {successMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2
                ${mode === 'login' 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' 
                  : (mode === 'forgot' ? 'bg-slate-700 hover:bg-slate-800 shadow-slate-600/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20')
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  {mode === 'login' && (
                    <>安全登录 <LogIn className="w-5 h-5" /></>
                  )}
                  {mode === 'register' && (
                    <>立即注册 <ArrowRight className="w-5 h-5" /></>
                  )}
                  {mode === 'forgot' && (
                    <>重置密码 <KeyRound className="w-5 h-5" /></>
                  )}
                </>
              )}
            </button>
          </form>
          
          {/* Toggle Mode */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            {mode === 'login' ? (
              <>
                <p className="text-sm text-slate-500 mb-2">还没有账号？</p>
                <button
                  onClick={() => setMode('register')}
                  className="text-sm font-bold hover:underline transition-colors text-blue-600"
                >
                  点击这里免费注册
                </button>
              </>
            ) : (
              <button
                onClick={() => setMode('login')}
                className="text-sm font-bold hover:underline transition-colors text-slate-600"
              >
                返回登录
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};