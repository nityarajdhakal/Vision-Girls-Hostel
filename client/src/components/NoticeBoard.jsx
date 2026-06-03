const NoticeBoard = ({ notices }) => {
  const noticeItems = Array.isArray(notices) ? notices : [];

  return (
    <div className="space-y-4">
      {noticeItems.map((notice) => (
        <div key={notice._id} className="rounded-3xl border border-plum/10 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h4 className="font-semibold text-plum">{notice.title}</h4>
            <span className={`rounded-full px-3 py-1 text-xs ${notice.category === 'urgent' ? 'bg-rose-100 text-rose-800' : notice.category === 'maintenance' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {notice.category}
            </span>
          </div>
          <p className="mt-3 text-sm text-plum/75">{notice.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NoticeBoard;
