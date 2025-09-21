"use client";

import { useEffect } from 'react';

interface DownloadLink {
  name: string;
  url: string;
  password?: string;
  size?: string;
}

interface DownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  downloadLinks: DownloadLink[];
}

export default function DownloadDialog({ isOpen, onClose, gameTitle, downloadLinks }: DownloadDialogProps) {
  // ESC键关闭对话框
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // 这里可以添加复制成功的提示
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#141414] rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-white/5">
        {/* 对话框头部 */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">下载 {gameTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="关闭对话框"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 对话框内容 */}
        <div className="px-6 pb-6">
          {downloadLinks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400">暂无下载链接</div>
            </div>
          ) : (
            <div className="space-y-3">
              {downloadLinks.map((link, index) => (
                <div key={index} className="group bg-white/5 hover:bg-white/8 rounded-2xl p-4 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm">{link.name}</h3>
                        {link.size && (
                          <p className="text-xs text-gray-500">{link.size}</p>
                        )}
                      </div>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      前往下载
                    </a>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-12 flex-shrink-0">链接</span>
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <code className="text-xs text-gray-300 bg-black/30 px-2 py-1.5 rounded-lg flex-1 min-w-0 truncate">
                          {link.url}
                        </code>
                        <button
                          onClick={() => copyToClipboard(link.url)}
                          className="text-gray-500 hover:text-white transition-colors p-1"
                          title="复制链接"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {link.password && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-12 flex-shrink-0">密码</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-yellow-400 bg-black/30 px-2 py-1.5 rounded-lg font-mono">
                            {link.password}
                          </code>
                          <button
                            onClick={() => copyToClipboard(link.password!)}
                            className="text-gray-500 hover:text-white transition-colors p-1"
                            title="复制密码"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
