export default function UserAvatar({ user, size = "md" }) {
  console.log('UserAvatar props:', { user, size });
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden`}>
      {user?.photo ? (
        <img
          src={user.photo}
          alt={user.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            console.error('Image failed to load:', user.photo);
            e.target.src = 'https://randomuser.me/api/portraits/women/4.jpg';
          }}
        />
      ) : (
        <div className="h-full w-full bg-primary-100 flex items-center justify-center">
          <span className="text-primary-600 font-medium">
            {user?.name?.[0]?.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
} 