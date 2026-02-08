import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom"
import { forwardRef, memo } from "react"
import { cn } from "@/lib/utils"

interface NavLinkCompatProps
  extends Omit<NavLinkProps, "className"> {
  className?: string
  activeClassName?: string
  pendingClassName?: string
  exact?: boolean
}

const NavLinkBase = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      exact = false,
      to,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        end={exact}
        aria-current="page"
        className={({ isActive, isPending }) =>
          cn(
            className,
            isActive && activeClassName,
            isPending && pendingClassName
          )
        }
        {...props}
      >
        {children}
      </RouterNavLink>
    )
  }
)

NavLinkBase.displayName = "NavLink"

export const NavLink = memo(NavLinkBase)
