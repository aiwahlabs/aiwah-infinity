'use client';

import { 
  Box, 
  Flex, 
  Image, 
  Button, 
  HStack, 
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  VStack,
  IconButton
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiChevronRight, FiUser, FiLogOut, FiSettings, FiHome } from 'react-icons/fi';
import { ReactNode } from 'react';
import { useAuth } from '@saas-ui/auth';

export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  isActive?: boolean;
}

interface AppHeaderProps {
  appName: string;
  appIcon?: React.ElementType;
  appIconSrc?: string;
  variant?: 'app' | 'home';
  rightContent?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

function UserMenu() {
  const { user, logOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Menu>
      <MenuButton>
        <Avatar 
          size="xs" 
          name={user?.email || 'User'} 
          src={user?.user_metadata?.avatar_url}
          bg="teal.500"
          color="white"
          cursor="pointer"
          _hover={{
            bg: 'teal.400',
            transform: 'scale(1.05)',
          }}
          transition="all 0.2s"
        />
      </MenuButton>
      <MenuList bg="gray.800" borderColor="gray.600">
        <Box px={3} py={2}>
          <VStack spacing={1} align="start">
            <Text fontSize="sm" fontWeight="medium" color="gray.100">
              {user?.user_metadata?.full_name || 'User'}
            </Text>
            <Text fontSize="xs" color="gray.400">
              {user?.email}
            </Text>
          </VStack>
        </Box>
        <MenuDivider borderColor="gray.600" />
        <MenuItem 
          icon={<FiUser />} 
          bg="transparent"
          _hover={{ bg: 'gray.700' }}
          color="gray.100"
          fontSize="sm"
        >
          Profile
        </MenuItem>
        <MenuItem 
          icon={<FiSettings />}
          bg="transparent"
          _hover={{ bg: 'gray.700' }}
          color="gray.100"
          fontSize="sm"
        >
          Settings
        </MenuItem>
        <MenuDivider borderColor="gray.600" />
        <MenuItem 
          icon={<FiLogOut />}
          onClick={handleLogout}
          bg="transparent"
          _hover={{ bg: 'red.900', color: 'red.200' }}
          color="gray.100"
          fontSize="sm"
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

// Shared Home Icon Component - always identical appearance, same size as other icons
function HomeIcon({ isClickable = false, href = '/home' }: { isClickable?: boolean, href?: string }) {
  const baseProps = {
    variant: "ghost" as const,
    icon: <FiHome size={14} />,
    "aria-label": "Navigate to main page",
    minW: "32px",
    h: "32px",
    px: 2,
    py: 1,
  };

  if (isClickable) {
    return (
      <IconButton
        as={Link}
        href={href}
        {...baseProps}
        color="teal.400"
        _hover={{ 
          color: 'teal.300',
          bg: 'gray.700'
        }}
        transition="all 0.2s"
        cursor="pointer"
      />
    );
  }

  // Non-clickable (current page)
  return (
    <IconButton
      {...baseProps}
      color="white"
      _hover={{ bg: 'transparent' }}
      cursor="default"
    />
  );
}

function BreadcrumbNavigation({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <HStack spacing={0} align="center">
      {breadcrumbs.map((item, index) => (
        <HStack key={item.href} spacing={0} align="center">
          {index > 0 && (
            <Box px={1}>
              <FiChevronRight size={12} color="#9CA3AF" />
            </Box>
          )}
          
          {item.label === 'Home' ? (
            // Home always uses the shared component - no text, just icon
            <HomeIcon isClickable={!item.isActive} href={item.href} />
          ) : item.isActive ? (
            // Current page - clearly not clickable, very muted
            <Box
              px={2}
              py={1}
              h="32px"
              color="gray.500"
              fontSize="sm"
              fontWeight="normal"
              display="flex"
              alignItems="center"
              gap={1}
            >
              {item.icon && <item.icon size={14} />}
              <Text>{item.label}</Text>
            </Box>
          ) : (
            // Clickable breadcrumb
            <Button
              as={Link}
              href={item.href}
              variant="ghost"
              size="sm"
              leftIcon={item.icon ? <item.icon size={14} /> : undefined}
              color="gray.400"
              _hover={{ 
                color: 'teal.400',
                bg: 'gray.700'
              }}
              transition="all 0.2s"
              px={2}
              py={1}
              h="32px"
              minH="32px"
              fontSize="sm"
            >
              {item.label}
            </Button>
          )}
        </HStack>
      ))}
    </HStack>
  );
}

export function AppHeader({ 
  appName, 
  appIcon: AppIcon, 
  appIconSrc,
  variant = 'app',
  rightContent,
  breadcrumbs
}: AppHeaderProps) {
  const isHome = variant === 'home';
  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0;
  
  return (
    <Box 
      as="header" 
      py={2}
      px={4}
      borderBottom="1px" 
      borderColor="gray.600" 
      bg="gray.800"
      width="100%"
      zIndex={10}
    >
      <Flex justifyContent="space-between" alignItems="center">
        {hasBreadcrumbs ? (
          <BreadcrumbNavigation breadcrumbs={breadcrumbs} />
        ) : (
          isHome ? (
            // Home state - just the icon, same size as breadcrumb icons
            <HomeIcon isClickable={false} />
          ) : (
            // Other apps - clickable app name
            <Button
              as={Link}
              href="/home"
              variant="ghost"
              leftIcon={AppIcon ? <AppIcon size={14} /> : undefined}
              color="teal.400"
              fontSize="sm"
              fontWeight="medium"
              _hover={{ 
                color: 'teal.300',
                bg: 'gray.700'
              }}
              px={2}
              py={1}
              h="32px"
              minH="32px"
            >
              {appIconSrc && (
                <Image src={appIconSrc} alt={`${appName} Icon`} h="16px" mr={2} />
              )}
              {appName}
            </Button>
          )
        )}
        
        {rightContent || <UserMenu />}
      </Flex>
    </Box>
  );
}