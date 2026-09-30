import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Inbox,
  Star,
  Send,
  FileEdit,
  Archive,
  Trash2,
  Search,
  CornerUpLeft,
  CornerUpRight,
  MoreHorizontal,
  Paperclip,
  Mic,
  ShieldCheck
} from 'lucide-react';

interface InboxMockupProps {
  onOpenVoiceRAG?: () => void;
}

interface MessageItem {
  id: string;
  name: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  tag: string;
  tagColor: string;
  avatarLetter: string;
  summary: string;
  paragraphs: string[];
  attachment?: string;
}

const MESSAGES: MessageItem[] = [
  {
    id: '1',
    name: 'Linear',
    subject: 'Weekly product digest',
    preview: 'Your team shipped 23 issues this week...',
    time: '9:41 AM',
    unread: true,
    tag: 'Work',
    tagColor: '#00d2ff',
    avatarLetter: 'L',
    summary: 'Your team closed 23 issues, merged 14 PRs, and shipped 2 features. Top contributor: Marcus. No action needed.',
    paragraphs: [
      'Hi team,',
      'Here is your weekly digest of everything happening across your projects. This was a strong week with significant progress on the Q3 roadmap.',
      'Twenty-three issues were closed, fourteen pull requests were merged, and two customer-facing features went out. The velocity trend continues to climb.',
      'Let me know if you would like a deeper breakdown by project or contributor.',
      '— The Linear team'
    ],
    attachment: 'digest-may-6.pdf'
  },
  {
    id: '2',
    name: 'Sophia Chen',
    subject: 'Re: Q3 roadmap review',
    preview: 'Thanks for sending the deck over. I had a few thoughts...',
    time: '8:12 AM',
    unread: true,
    tag: 'Work',
    tagColor: '#00d2ff',
    avatarLetter: 'S',
    summary: 'Sophia reviewed the Q3 deck. Major feedback on timeline milestones and cross-functional capacity.',
    paragraphs: [
      'Hey everyone,',
      'Thanks for sending the deck over. I had a few thoughts on the timeline for Milestone 2.',
      'Can we jump on a quick 10-minute sync this afternoon to finalize the resource allocation?',
      'Best,',
      'Sophia'
    ]
  },
  {
    id: '3',
    name: 'Figma',
    subject: 'Marcus commented on your file',
    preview: 'Love the new direction on the landing hero.',
    time: 'Yesterday',
    unread: false,
    tag: 'Design',
    tagColor: '#A4F4FD',
    avatarLetter: 'F',
    summary: 'Design critique feedback on the hero gradient and liquid-glass treatments.',
    paragraphs: [
      'Marcus left a comment on Aura Landing v4:',
      '"Love the new direction on the landing hero. The glass reflection on the pricing cards feels especially crisp."',
      'View comment in Figma.'
    ]
  },
  {
    id: '4',
    name: 'Stripe',
    subject: 'Payout of $12,480.00 sent',
    preview: 'Your payout is on its way to your bank...',
    time: 'Yesterday',
    unread: false,
    tag: 'Finance',
    tagColor: '#10b981',
    avatarLetter: '$',
    summary: 'Routine settlement transfer of $12,480.00 initiated to primary checking.',
    paragraphs: [
      'Your payout of $12,480.00 is on its way to your bank account ending in 4108.',
      'Estimated arrival date is Thursday, May 7th.',
      'Questions? Contact Stripe Support.'
    ]
  },
  {
    id: '5',
    name: 'Vercel',
    subject: 'Deployment ready for aura-web',
    preview: 'Preview is live at aura-web-g3f.vercel.app',
    time: 'Mon',
    unread: false,
    tag: 'Dev',
    tagColor: '#00d2ff',
    avatarLetter: 'V',
    summary: 'Automatic build successful on branch main with 100/100 Lighthouse performance.',
    paragraphs: [
      'Preview is live at https://aura-web-g3f.vercel.app',
      'Branch: main (commit 9bf4c2a)',
      'Total build time: 24s.'
    ]
  },
  {
    id: '6',
    name: 'GitHub',
    subject: '[aura/core] PR #482 approved',
    preview: 'david-lim approved your pull request.',
    time: 'Mon',
    unread: false,
    tag: 'Dev',
    tagColor: '#00d2ff',
    avatarLetter: 'G',
    summary: 'PR #482 passed automated security audits and review approvals.',
    paragraphs: [
      'david-lim approved your pull request #482 (zero-trust context builder isolation).',
      'All 42 integration checks passed.'
    ]
  }
];

export const InboxMockup: React.FC<InboxMockupProps> = ({ onOpenVoiceRAG }) => {
  const [activeMessageId, setActiveMessageId] = useState('1');
  const [activeFolder, setActiveFolder] = useState('inbox');
  const activeMessage = MESSAGES.find(m => m.id === activeMessageId) || MESSAGES[0];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      {/* Outer Window Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)]"
      >
        {/* macOS Title Bar */}
        <div className="h-10 px-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="text-xs text-white/50 font-medium">Aura — Inbox</div>
          <div className="w-12 flex justify-end">
            <button
              onClick={onOpenVoiceRAG}
              className="flex items-center gap-1 text-[11px] font-mono text-[#00d2ff] hover:underline"
              title="Launch RIPTIDE Voice Assistant"
            >
              <Mic className="w-3 h-3" />
              <span className="hidden sm:inline">RIPTIDE</span>
            </button>
          </div>
        </div>

        {/* 12-Column Layout */}
        <div className="grid grid-cols-12 h-[520px] text-xs">
          {/* Sidebar (col-span-3, border-r, bg-black/30, p-4) */}
          <div className="col-span-3 border-r border-white/10 bg-black/30 p-4 flex flex-col justify-between hidden md:flex">
            <div>
              {/* White Compose Button */}
              <button
                onClick={onOpenVoiceRAG}
                className="w-full rounded-lg bg-white text-black text-xs font-semibold px-3 py-2 flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-md mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0B2551]" />
                <span>Compose with Aura</span>
              </button>

              {/* Navigation Items */}
              <div className="space-y-1">
                {[
                  { id: 'inbox', label: 'Inbox', icon: Inbox, count: 12 },
                  { id: 'starred', label: 'Starred', icon: Star, count: 3 },
                  { id: 'sent', label: 'Sent', icon: Send },
                  { id: 'drafts', label: 'Drafts', icon: FileEdit, count: 2 },
                  { id: 'archive', label: 'Archive', icon: Archive },
                  { id: 'trash', label: 'Trash', icon: Trash2 },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeFolder === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveFolder(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </div>
                      {item.count && (
                        <span className="text-[11px] text-white/40">{item.count}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Labels Section */}
              <div className="mt-8">
                <div className="text-[10px] uppercase font-mono tracking-wider text-white/40 px-3 mb-2">
                  Labels
                </div>
                <div className="space-y-1.5 px-3">
                  {[
                    { label: 'Work', color: '#00d2ff' },
                    { label: 'Personal', color: '#A4F4FD' },
                    { label: 'Travel', color: '#f59e0b' },
                    { label: 'Finance', color: '#10b981' }
                  ].map(lbl => (
                    <div key={lbl.label} className="flex items-center gap-2 text-white/70 hover:text-white cursor-pointer py-0.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lbl.color }} />
                      <span className="text-xs">{lbl.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Zero-Trust Radar Pill */}
            <div
              onClick={onOpenVoiceRAG}
              className="p-2.5 rounded-xl border border-[#00d2ff]/20 bg-[#00d2ff]/5 hover:bg-[#00d2ff]/10 cursor-pointer transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
              <div className="flex-1">
                <div className="text-[11px] font-semibold text-white">RIPTIDE Voice RAG</div>
                <div className="text-[10px] text-white/50">Zero-Trust Archive Active</div>
              </div>
            </div>
          </div>

          {/* Message List (col-span-4, border-r) */}
          <div className="col-span-12 md:col-span-4 border-r border-white/10 flex flex-col bg-black/10">
            {/* Search Header */}
            <div className="p-3 border-b border-white/10 flex items-center gap-2 text-white/40">
              <Search className="w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search mail"
                className="bg-transparent text-xs text-white placeholder-white/40 focus:outline-none w-full"
              />
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {MESSAGES.map(msg => {
                const isSelected = activeMessageId === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => setActiveMessageId(msg.id)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/10 border-l-2 border-[#00d2ff]'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${isSelected ? 'text-white' : 'text-white/90'}`}>
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-white/40">{msg.time}</span>
                    </div>
                    <div className="font-medium text-white/80 text-xs truncate mb-0.5">
                      {msg.subject}
                    </div>
                    <div className="text-white/50 text-[11px] line-clamp-1">
                      {msg.preview}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reader (col-span-5) */}
          <div className="col-span-12 md:col-span-5 flex flex-col bg-black/20 overflow-y-auto">
            {/* Toolbar */}
            <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1 text-white/60">
                <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center">
                  <CornerUpLeft className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center">
                  <CornerUpRight className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center">
                  <Archive className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-white/60">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Email Header */}
            <div className="p-5 border-b border-white/10 shrink-0">
              <h3 className="text-base font-semibold text-white mb-3 tracking-tight">
                {activeMessage.subject}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-white text-xs">
                    {activeMessage.avatarLetter}
                  </div>
                  <div>
                    <span className="font-semibold text-white text-xs block">{activeMessage.name}</span>
                    <span className="text-[11px] text-white/50">to me · {activeMessage.time}</span>
                  </div>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                  style={{
                    color: activeMessage.tagColor,
                    borderColor: `${activeMessage.tagColor}40`,
                    backgroundColor: `${activeMessage.tagColor}15`
                  }}
                >
                  {activeMessage.tag}
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-5 space-y-4 flex-1">
              {/* Card with Sparkles icon: Summary by Aura */}
              <div className="liquid-glass rounded-xl p-3.5 border border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A4F4FD] mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A4F4FD]" />
                  <span>Summary by Aura</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  {activeMessage.summary}
                </p>
              </div>

              {/* Message Paragraphs */}
              <div className="space-y-2.5 text-xs text-white/70 leading-relaxed font-sans">
                {activeMessage.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Attachment Pill if available */}
              {activeMessage.attachment && (
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-white/80 hover:bg-white/10 cursor-pointer transition-colors">
                    <Paperclip className="w-3.5 h-3.5 text-[#00d2ff]" />
                    <span>{activeMessage.attachment}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
