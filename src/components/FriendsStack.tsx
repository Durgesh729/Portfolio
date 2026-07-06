import './FriendsStack.css';

const friends = [
    { initials: 'KG', name: 'Krishnakumar Gupta', url: 'https://www.linkedin.com/in/krishnkumar-gupta-9936a9322/' },
    { initials: 'SB', name: 'Siddharth Bhuta', url: 'https://www.linkedin.com/in/siddharth-bhuta-155b13322/' },
    { initials: 'CK', name: 'Chaitanya Khurd', url: 'https://www.linkedin.com/in/chaitanyakhurd/' },
    { initials: 'SS', name: 'Saurabh Sawant', url: 'https://www.linkedin.com/in/saurabhsawant24/' },
    { initials: 'VP', name: 'Varad Paradkar', url: 'https://www.linkedin.com/in/varad-paradkar-503643329/' }
];

const FriendsStack = () => {
    return (
        <div className="avatar-stack">
            {friends.map((friend, index) => (
                <a 
                    key={index}
                    href={friend.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="avatar"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    <span>{friend.initials}</span>
                    <div className="tooltip">{friend.name}</div>
                </a>
            ))}
        </div>
    );
};

export default FriendsStack;
