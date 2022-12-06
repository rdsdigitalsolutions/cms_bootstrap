import { useRouter } from 'next/router';
import { Navbar } from '@nextui-org/react';

export default function ComponentHandler({ sessionStatus, path, name }) {
  const router = useRouter();
  const isActive = router.asPath === path
  const handleClick = (event) => {
    event.preventDefault();
    router.push(path);
  }

  if( sessionStatus ) {
    return sessionStatus !== 'authenticated' ? null : <Navbar.Link onClick={handleClick} isActive={isActive}>{name}</Navbar.Link>
  } else {
    return <Navbar.Link onClick={handleClick} isActive={isActive}>{name}</Navbar.Link>
  }
}
