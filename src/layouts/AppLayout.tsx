import { Flex, Tooltip } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import "./app-layout.scss";
import clsx from 'clsx';
import { DoubleLeftOutlined, DoubleRightOutlined, LoginOutlined, NumberOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import Logo from '@/assets/icons/logo.svg?react';
import Board from '@/assets/icons/board.svg?react';
import Home from '@/assets/icons/home.svg?react';
import Logging from '@/assets/icons/logging.svg?react';
import Topic from '@/assets/icons/topic.svg?react';
import WorkList from '@/assets/icons/work-list.svg?react';
import { useRecoilState } from 'recoil';
import { collapseSidebarState } from '@/stores/useCommStore';

export default function AppLayout() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useRecoilState(collapseSidebarState);

  const menus = [
    {
      icon: <Home />,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: <Board />,
      label: 'Board',
      path: '/about'
    },
    {
      icon: <WorkList />,
      label: 'Work List',
      path: '/flow'
    },
    {
      icon: <Topic />,
      label: 'Topic',
      path: '/ptee-flow'
    },
    {
      icon: <Logging />,
      label: 'Library',
      path: '/lib'
    },
    {
      icon: <NumberOutlined style={{ fontSize: 24 }} />,
      label: 'Caro',
      path: '/caro-friends'
    },
  ]

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate, location]);

  return (
    <>
      <Flex className='app-layout w-screen h-screen'>
        {
          isCollapsed
            ? <Flex className='app-sidebar app-sidebar-collapse h-full' justify='space-between' gap={24} vertical>
              <Flex gap={24} vertical>
                <div className='mb-10 text-center'>
                  <Link to="/dashboard">
                    <Logo />
                  </Link>
                </div>

                {
                  menus.map((menu, index: number) => (
                    <Tooltip
                      key={`${menu.label}-${index}`}
                      title={menu.label}
                      placement='right'
                    >
                      <Link
                        className={clsx("menu-item flex items-center gap-3", pathname === menu.path ? "menu-item-active" : "")}
                        to={menu.path}
                      >
                        {menu.icon}
                      </Link>
                    </Tooltip>
                  ))
                }
              </Flex>

              <div>
                <Flex align='center' justify='center' gap={16}>
                  Bin
                </Flex>

                <div className='mt-3 text-center'>
                  <DoubleRightOutlined onClick={() => setIsCollapsed(false)} />
                </div>
              </div>
            </Flex>
            : <Flex className='app-sidebar h-full' justify='space-between' gap={24} vertical>
              <Flex gap={24} vertical>
                <Link to="/dashboard">
                  <Flex className='mb-10 text-black' align='center' gap={8}>
                    <Logo />
                    <span className='text-2xl font-semibold'>
                      My Work
                    </span>
                    <span className='text-sm mt-[6px]'>DevOn JPA</span>
                  </Flex>
                </Link>

                {
                  menus.map((menu, index: number) => (
                    <Link
                      key={`${menu.label}-${index}`}
                      className={clsx("menu-item flex items-center gap-3", pathname === menu.path ? "menu-item-active" : "")}
                      to={menu.path}
                    >
                      {menu.icon}
                      {menu.label}
                    </Link>
                  ))
                }
              </Flex>

              <div>
                <Flex align='center' justify='space-between' gap={16}>
                  <div>
                    Bin Nguyen
                  </div>
                  <LoginOutlined />
                </Flex>

                <div className="mt-3 text-right">
                  <DoubleLeftOutlined className='cursor-pointer' onClick={() => setIsCollapsed(true)} />
                </div>
              </div>
            </Flex>
        }

        <div className='app-content px-9 p-8 flex-1 h-full'>
          <Outlet></Outlet>
        </div>
      </Flex >
      {/* <Row className='app-layout w-full h-full font-sans' gutter={[16, 16]}>
        <Col span={4}>
          <Flex className='fixed min-w-[250px] m-4 p-4 bg-white rounded shadow text-lg text-black font-bold' align='center' gap={8} vertical>
            {
              router.routes[0].children?.map((route, index) =>
                <Link
                  key={`${route.path}-${index}`}
                  className={clsx("menu-tab", pathname === `/${route.path}` ? 'menu-tab-active' : '')}
                  to={route.path ?? ""}
                >
                  {String(route.path).charAt(0).toUpperCase() + route.path?.slice(1)}
                </Link>
              )
            }
          </Flex>
        </Col>

        <Col span={20}>
          <Flex className="p-4 h-screen" flex={1}>
            <Outlet></Outlet>
          </Flex>
        </Col>
      </Row> */}
    </>
  );
}
