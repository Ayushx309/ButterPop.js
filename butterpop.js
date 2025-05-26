/**
 * ButterPop.js - A lightweight, customizable toast notification library
 * Author: Ayushx309 (https://github.com/Ayushx309)
 * Version: 1.0.4
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ButterPop = factory());
}(this, (function () {
  'use strict';
  
  // SVG Icons for different toast types
  const ICONS = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  };
  
  // Storage for active toasts and their IDs
  const toastStorage = {
    idCounter: 0,
    activeToasts: new Map(),
    containers: new Map(),
    queuedToasts: new Map()
  };
  
  // Default configuration for toasts
  const DEFAULT_CONFIG = {
    position: 'top-right',
    duration: 5000,  // milliseconds
    closable: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    progress: false,
    theme: 'default',
    maxVisible: 5,
    preventDuplicates: false,
    escapeHtml: true,
    rtl: false,
    closeOnClick: false,
    showClass: 'butterpop-enter',
    hideClass: 'butterpop-exit',
    autoInject: true,
    animation: {
      type: 'slide',  // 'slide', 'fade', 'bounce'
      duration: 300   // milliseconds
    },
    accessibility: {
      role: 'alert',
      ariaLive: 'polite',
      ariaRelevant: 'additions text',
      closeAriaLabel: 'Close notification'
    }
  };
  
  // Merge user config with default config
  const mergeConfig = (userConfig = {}) => {
    const config = { ...DEFAULT_CONFIG };
    
    // Deep merge for nested objects (like animation and accessibility)
    for (const key in userConfig) {
      if (userConfig.hasOwnProperty(key)) {
        if (
          typeof userConfig[key] === 'object' && 
          userConfig[key] !== null &&
          typeof config[key] === 'object' &&
          config[key] !== null
        ) {
          config[key] = { ...config[key], ...userConfig[key] };
        } else {
          config[key] = userConfig[key];
        }
      }
    }
    
    return config;
  };
  
  // Global configuration
  let globalConfig = { ...DEFAULT_CONFIG };
  
  // Check if an element exists in document
  const elementExists = (selector) => {
    return document.querySelector(selector) !== null;
  };
  
  // Create a toast container for a specific position
  const createContainer = (position) => {
    // If container already exists for this position, return it
    if (toastStorage.containers.has(position)) {
      return toastStorage.containers.get(position);
    }
    
    const container = document.createElement('div');
    container.className = `butterpop-container ${position}`;
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Notifications');
    container.setAttribute('data-max-visible', globalConfig.maxVisible);
    document.body.appendChild(container);
    
    toastStorage.containers.set(position, container);
    return container;
  };
  
  // Escape HTML to prevent XSS
  const escapeHtml = (unsafe) => {
    if (typeof unsafe !== 'string') {
      return unsafe;
    }
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  // Generate a unique ID for each toast
  const generateId = () => {
    toastStorage.idCounter++;
    return `butterpop-${toastStorage.idCounter}`;
  };
  
  // Create DOM elements for a toast
  const createToastElement = (options) => {
    const { 
      id, 
      message, 
      type, 
      closable, 
      icon, 
      progress, 
      duration, 
      actions,
      theme,
      accessibility
    } = options;
    
    // Toast root element
    const toast = document.createElement('div');
    toast.className = `butterpop-toast ${type || ''}`;
    if (theme && theme !== 'default') {
      toast.classList.add(`theme-${theme}`);
      
      // Check for dark mode when using neumorphism theme
      if (theme === 'neumorphism') {
        const isDarkMode = document.body.classList.contains('dark-mode') || 
                          (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDarkMode) {
          toast.classList.add('dark-theme');
        }
      }
      
      // Support for specialized themes like holographic and aurora that have animations
      if (['holographic', 'aurora'].includes(theme)) {
        toast.classList.add('animated-theme');
      }
    }
    toast.id = id;
    toast.setAttribute('role', accessibility.role);
    toast.setAttribute('aria-live', accessibility.ariaLive);
    toast.setAttribute('aria-relevant', accessibility.ariaRelevant);
    toast.setAttribute('tabindex', '0');
    toast.style.setProperty('--duration', `${duration}ms`);
    
    // Icon element
    if (icon !== false) {
      const iconEl = document.createElement('div');
      iconEl.className = 'butterpop-icon';
      iconEl.innerHTML = icon || ICONS[type] || '';
      iconEl.setAttribute('aria-hidden', 'true');
      toast.appendChild(iconEl);
    }
    
    // Content wrapper
    const content = document.createElement('div');
    content.className = 'butterpop-content';
    
    // Message
    const messageEl = document.createElement('p');
    messageEl.className = 'butterpop-message';
    messageEl.innerHTML = options.escapeHtml ? escapeHtml(message) : message;
    content.appendChild(messageEl);
    
    // Action buttons
    if (actions && actions.length) {
      const actionsEl = document.createElement('div');
      actionsEl.className = 'butterpop-actions';
      
      actions.forEach((action, index) => {
        const btn = document.createElement('button');
        btn.className = 'butterpop-action-btn';
        btn.textContent = action.text;
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-label', action.ariaLabel || action.text);
        
        if (action.className) {
          btn.className += ` ${action.className}`;
        }
        
        btn.addEventListener('click', (event) => {
          event.stopPropagation();
          if (typeof action.callback === 'function') {
            action.callback(toast);
          }
        });
        
        actionsEl.appendChild(btn);
      });
      
      content.appendChild(actionsEl);
    }
    
    toast.appendChild(content);
    
    // Close button
    if (closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'butterpop-close';
      closeBtn.innerHTML = '×';
      closeBtn.setAttribute('type', 'button');
      closeBtn.setAttribute('aria-label', accessibility.closeAriaLabel);
      closeBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        removeToast(id);
      });
      toast.appendChild(closeBtn);
    }
    
    // Progress bar
    if (progress && duration && duration > 0) {
      const progressBar = document.createElement('div');
      progressBar.className = 'butterpop-progress';
      // Set custom progress color if provided
      if (options.progressColor) {
        progressBar.style.background = options.progressColor;
      }
      toast.appendChild(progressBar);
      
      // Start progress animation after a short delay to ensure DOM is updated
      setTimeout(() => {
        progressBar.style.transition = `transform ${duration}ms linear`;
        progressBar.style.transform = 'scaleX(1)';
      }, 10);
    }
    
    return toast;
  };
  
  // Add toast to DOM
  const addToastToDOM = (toast, container) => {
    // Add show class for animation
    toast.classList.add(globalConfig.showClass);
    
    // First child for bottom positions (to maintain order)
    if (container.classList.contains('bottom-left') || 
        container.classList.contains('bottom-right') ||
        container.classList.contains('bottom-center')) {
      container.insertBefore(toast, container.firstChild);
    } else {
      container.appendChild(toast);
    }
    
    // Trigger reflow for animation
    toast.offsetHeight;
    
    // Remove show class to start animation
    setTimeout(() => {
      toast.classList.remove(globalConfig.showClass);
    }, 10);
    
    // Handle max visible toasts limit
    const maxVisible = parseInt(container.getAttribute('data-max-visible'), 10) || globalConfig.maxVisible;
    const visibleToasts = container.querySelectorAll('.butterpop-toast:not(.butterpop-exit)');
    
    if (visibleToasts.length > maxVisible) {
      // Find oldest toast and remove it
      const oldestToasts = Array.from(visibleToasts)
        .slice(0, visibleToasts.length - maxVisible);
      
      oldestToasts.forEach(oldToast => {
        removeToast(oldToast.id);
      });
    }
  };
  
  // Remove toast from DOM
  let removeToast = (id) => {
    const toastData = toastStorage.activeToasts.get(id);
    if (!toastData) return false;
    
    const { element, timeoutId } = toastData;
    if (!element) return false;
    
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Add exit class for animation
    element.classList.add(globalConfig.hideClass);
    
    // Call onClose callback if provided
    if (toastData.options && typeof toastData.options.onClose === 'function') {
      toastData.options.onClose(element);
    }
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      
      // Remove from storage
      toastStorage.activeToasts.delete(id);
      
      // Process queue if any
      processQueue(toastData.options.position);
    }, globalConfig.animation.duration);
    
    return true;
  };
  
  // Process the queue for a specific position
  const processQueue = (position) => {
    // If no position-specific queue, exit
    if (!toastStorage.queuedToasts.has(position)) return;
    
    const queue = toastStorage.queuedToasts.get(position);
    if (!queue.length) return;
    
    // Get container
    const container = toastStorage.containers.get(position);
    if (!container) return;
    
    // Count visible toasts
    const visibleCount = container.querySelectorAll('.butterpop-toast:not(.butterpop-exit)').length;
    const maxVisible = parseInt(container.getAttribute('data-max-visible'), 10) || globalConfig.maxVisible;
    
    // If we have room for more, show from queue
    if (visibleCount < maxVisible) {
      // Get the first toast from queue
      const nextToast = queue.shift();
      if (!nextToast) return;
      
      // Show it
      showToast(nextToast.options);
      
      // If queue is now empty, remove the queue
      if (queue.length === 0) {
        toastStorage.queuedToasts.delete(position);
      }
    }
  };
  
  // Check if a toast with the same message already exists
  const hasDuplicate = (message, type, position) => {
    for (const [id, data] of toastStorage.activeToasts.entries()) {
      const options = data.options;
      if (
        options.message === message && 
        options.type === type && 
        options.position === position
      ) {
        return true;
      }
    }
    return false;
  };
  
  // Add pause/resume event listeners to a toast
  const setupPauseListeners = (toast, options) => {
    if (!options.pauseOnHover && !options.pauseOnFocusLoss) {
      return;
    }
    
    const progressBar = toast.querySelector('.butterpop-progress');
    let timeLeft = options.duration;
    let isPaused = false;
    let startTime;
    let pauseStartTime;
    let pausedScale = 0;

    const pause = () => {
      if (isPaused) return;
      isPaused = true;
      pauseStartTime = Date.now();
      
      // Clear the auto-close timeout
      if (toastStorage.activeToasts.has(toast.id)) {
        const timeoutId = toastStorage.activeToasts.get(toast.id).timeoutId;
        if (timeoutId) {
          clearTimeout(timeoutId);
          toastStorage.activeToasts.get(toast.id).timeoutId = null;
        }
      }
      
      // Pause the progress bar
      if (progressBar) {
        // Calculate time left more accurately
        const elapsedTime = pauseStartTime - startTime;
        timeLeft = Math.max(0, options.duration - elapsedTime);
        
        // Calculate the current scale directly from elapsed time
        const progress = elapsedTime / options.duration;
        pausedScale = progress > 1 ? 1 : progress;
        
        // Stop any running transition and freeze at current position
        progressBar.style.transition = 'none';
        progressBar.style.transform = `scaleX(${pausedScale})`;
      }
    };
    
    const resume = () => {
      if (!isPaused) return;
      isPaused = false;
      
      // Reset the start time to now
      startTime = Date.now() - (options.duration - timeLeft);
      
      // Resume the auto-close timeout
      if (toastStorage.activeToasts.has(toast.id) && timeLeft > 0) {
        const newTimeoutId = setTimeout(() => {
          removeToast(toast.id);
        }, timeLeft);
        toastStorage.activeToasts.get(toast.id).timeoutId = newTimeoutId;
      }
      
      // Resume the progress bar animation from current position
      if (progressBar && timeLeft > 0) {
        // Apply smooth transition for remaining time
        setTimeout(() => {
          progressBar.style.transition = `transform ${timeLeft}ms linear`;
          progressBar.style.transform = 'scaleX(1)';
        }, 10);
      }
    };
    
    // Track starting time
    startTime = Date.now();
    
    // Pause on hover
    if (options.pauseOnHover) {
      toast.addEventListener('mouseenter', pause);
      toast.addEventListener('mouseleave', resume);
      
      // Also handle touch events for mobile
      toast.addEventListener('touchstart', pause, { passive: true });
      toast.addEventListener('touchend', resume, { passive: true });
    }
    
    // Pause on focus loss
    if (options.pauseOnFocusLoss) {
      const visibilityChangeHandler = () => {
        if (document.hidden) {
          pause();
        } else {
          resume();
        }
      };
      
      document.addEventListener('visibilitychange', visibilityChangeHandler);
      
      // Remove event listener when toast is removed
      const originalRemove = removeToast;
      removeToast = function(id) {
        if (id === toast.id) {
          document.removeEventListener('visibilitychange', visibilityChangeHandler);
          // Restore original function after this toast is removed
          removeToast = originalRemove;
        }
        return originalRemove(id);
      };
    }
  };
  
  // Main function to show a toast
  const showToast = (userOptions) => {
    // Merge with global config
    const options = mergeConfig({ ...globalConfig, ...userOptions });
    
    // Check for duplicates if prevention is enabled
    if (options.preventDuplicates && hasDuplicate(options.message, options.type, options.position)) {
      return null;
    }
    
    // Get/create container
    const container = createContainer(options.position);
    
    // Count visible toasts
    const visibleCount = container.querySelectorAll('.butterpop-toast:not(.butterpop-exit)').length;
    const maxVisible = parseInt(container.getAttribute('data-max-visible'), 10) || globalConfig.maxVisible;
    
    // Check if we need to queue this toast
    if (visibleCount >= maxVisible) {
      // Add to queue
      if (!toastStorage.queuedToasts.has(options.position)) {
        toastStorage.queuedToasts.set(options.position, []);
      }
      
      toastStorage.queuedToasts.get(options.position).push({ options });
      return null;
    }
    
    // Generate ID
    const id = generateId();
    options.id = id;
    
    // Create toast element
    const toastElement = createToastElement(options);
    
    // Set up auto-close timeout if duration is provided
    let timeoutId = null;
    if (options.duration && options.duration > 0) {
      timeoutId = setTimeout(() => {
        removeToast(id);
      }, options.duration);
    }
    
    // Store in active toasts
    toastStorage.activeToasts.set(id, {
      element: toastElement,
      timeoutId,
      options
    });
    
    // Add to DOM
    addToastToDOM(toastElement, container);
    
    // Set up pause/resume listeners
    setupPauseListeners(toastElement, options);
    
    // Click event
    if (options.onClick || options.closeOnClick) {
      toastElement.addEventListener('click', () => {
        if (typeof options.onClick === 'function') {
          options.onClick(toastElement);
        }
        
        if (options.closeOnClick) {
          removeToast(id);
        }
      });
    }
    
    // Return the toast ID so it can be referenced later
    return id;
  };
  
  // Injects CSS if autoInject is true
  const injectCSS = () => {
    if (!globalConfig.autoInject) return;
    
    // Check if CSS already exists
    if (elementExists('style[data-butterpop-css]')) return;
    
    // Try to load the CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/butterpop@1.0.4/butterpop.min.css';
    link.setAttribute('data-butterpop-css', 'true');
    document.head.appendChild(link);
    
    // Fallback: if CSS can't be loaded, add basic inline styles
    link.onerror = () => {
      if (elementExists('style[data-butterpop-css]')) return;
      
      const style = document.createElement('style');
      style.setAttribute('data-butterpop-css', 'true');
      style.textContent = `
        .butterpop-container{position:fixed;display:flex;flex-direction:column;z-index:9999;pointer-events:none;max-width:100%}
        .butterpop-container.top-left{top:16px;left:16px;align-items:flex-start}
        .butterpop-container.top-right{top:16px;right:16px;align-items:flex-end}
        .butterpop-container.bottom-left{bottom:16px;left:16px;align-items:flex-start}
        .butterpop-container.bottom-right{bottom:16px;right:16px;align-items:flex-end}
        .butterpop-container.top-center{top:16px;left:50%;transform:translateX(-50%);align-items:center}
        .butterpop-container.bottom-center{bottom:16px;left:50%;transform:translateX(-50%);align-items:center}
        .butterpop-container.center{top:50%;left:50%;transform:translate(-50%,-50%);align-items:center}
        .butterpop-toast{margin-bottom:12px;padding:12px 16px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);display:flex;align-items:center;max-width:400px;width:100%;box-sizing:border-box;position:relative;overflow:hidden;pointer-events:auto;transform-origin:center;transition:transform .3s ease-out,opacity .3s ease-out;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;cursor:default}
        .butterpop-icon{margin-right:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;width:24px;height:24px}
        .butterpop-content{flex:1;min-width:0}
        .butterpop-message{margin:0;padding:0;word-wrap:break-word;font-size:14px;line-height:1.5}
        .butterpop-close{background:none;border:none;cursor:pointer;font-size:18px;color:inherit;opacity:.5;margin-left:8px;padding:4px;display:flex;align-items:center;justify-content:center;transition:opacity .2s}
        .butterpop-close:hover{opacity:1}
        .butterpop-enter{opacity:0;transform:translateY(20px)}
        .butterpop-exit{opacity:0;transform:translateY(-20px);pointer-events:none}
      `;
      document.head.appendChild(style);
    };
  };
  
  // Initialize - called on load
  const init = () => {
    // Only initialize in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    
    // Inject CSS when DOM is ready
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', injectCSS);
    } else {
      injectCSS();
    }
    
    // Handle escape key for closing all toasts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close all toasts when ESC is pressed
        clearAll();
      }
    });
  };
  
  // Clear all toasts
  const clearAll = () => {
    // Get all active toast IDs
    const toastIds = Array.from(toastStorage.activeToasts.keys());
    
    // Remove each toast
    toastIds.forEach(id => {
      removeToast(id);
    });
    
    // Clear queues
    toastStorage.queuedToasts.clear();
    
    return toastIds.length;
  };
  
  // Clear toasts by position
  const clearToastsByPosition = (position) => {
    // Get all active toast IDs for this position
    const toastIds = [];
    
    for (const [id, data] of toastStorage.activeToasts.entries()) {
      if (data.options.position === position) {
        toastIds.push(id);
      }
    }
    
    // Remove each toast
    toastIds.forEach(id => {
      removeToast(id);
    });
    
    // Clear queue for this position
    toastStorage.queuedToasts.delete(position);
    
    return toastIds.length;
  };
  
  // Configure global defaults
  const configure = (userConfig) => {
    globalConfig = mergeConfig(userConfig);
    return globalConfig;
  };
  
  // Helper functions for common toast types
  const success = (message, options = {}) => {
    return showToast({ 
      message, 
      type: 'success', 
      ...options 
    });
  };
  
  const error = (message, options = {}) => {
    return showToast({ 
      message, 
      type: 'error', 
      ...options 
    });
  };
  
  const warning = (message, options = {}) => {
    return showToast({ 
      message, 
      type: 'warning', 
      ...options 
    });
  };
  
  const info = (message, options = {}) => {
    return showToast({ 
      message, 
      type: 'info', 
      ...options 
    });
  };
  
  // Create custom toast
  const custom = (options = {}) => {
    return showToast(options);
  };
  
  // Update an existing toast
  const update = (id, options = {}) => {
    if (!toastStorage.activeToasts.has(id)) {
      return false;
    }
    
    const toastData = toastStorage.activeToasts.get(id);
    const element = toastData.element;
    
    // Update message if provided
    if (options.message !== undefined) {
      const messageEl = element.querySelector('.butterpop-message');
      if (messageEl) {
        messageEl.innerHTML = options.escapeHtml !== false ? escapeHtml(options.message) : options.message;
      }
    }
    
    // Update type if provided
    if (options.type && options.type !== toastData.options.type) {
      // Remove old type class
      element.classList.remove(toastData.options.type);
      
      // Add new type class
      element.classList.add(options.type);
      
      // Update icon if it exists
      const iconEl = element.querySelector('.butterpop-icon');
      if (iconEl && options.icon !== false) {
        iconEl.innerHTML = options.icon || ICONS[options.type] || '';
      }
    }
    
    // Update theme if provided
    if (options.theme && options.theme !== toastData.options.theme) {
      // Remove old theme class
      if (toastData.options.theme && toastData.options.theme !== 'default') {
        element.classList.remove(`theme-${toastData.options.theme}`);
      }
      
      // Add new theme class
      if (options.theme !== 'default') {
        element.classList.add(`theme-${options.theme}`);
      }
    }
    
    // Update duration/timeout if provided
    if (options.duration !== undefined) {
      // Clear existing timeout
      if (toastData.timeoutId) {
        clearTimeout(toastData.timeoutId);
      }
      
      // Set new timeout if duration is valid
      if (options.duration && options.duration > 0) {
        const timeoutId = setTimeout(() => {
          removeToast(id);
        }, options.duration);
        
        toastData.timeoutId = timeoutId;
      }
    }
    
    // Update progress bar if it exists
    if (element.querySelector('.butterpop-progress') && options.duration) {
      const progressBar = element.querySelector('.butterpop-progress');
      progressBar.style.transition = 'none';
      progressBar.style.transform = 'scaleX(0)';
      // Update progress color if provided
      if (options.progressColor) {
        progressBar.style.background = options.progressColor;
      } else {
        progressBar.style.background = '';
      }
      // Reset the progress bar
      setTimeout(() => {
        progressBar.style.transition = `transform ${options.duration}ms linear`;
        progressBar.style.transform = 'scaleX(1)';
      }, 10);
    }
    
    // Update stored options
    toastData.options = { ...toastData.options, ...options };
    
    return true;
  };
  
  // Get info about currently active toasts
  const getToasts = () => {
    const result = [];
    
    for (const [id, data] of toastStorage.activeToasts.entries()) {
      result.push({
        id,
        type: data.options.type,
        message: data.options.message,
        position: data.options.position,
        theme: data.options.theme,
        duration: data.options.duration
      });
    }
    
    return result;
  };
  
  // Get info about queued toasts
  const getQueue = (position) => {
    if (position) {
      return toastStorage.queuedToasts.has(position) ? 
        toastStorage.queuedToasts.get(position).length : 0;
    }
    
    let total = 0;
    for (const queue of toastStorage.queuedToasts.values()) {
      total += queue.length;
    }
    
    return total;
  };
  
  // Call init function
  init();
  
  // Public API
  return {
    show: showToast,
    success,
    error,
    warning,
    info,
    custom,
    update,
    clearAll,
    clear: clearToastsByPosition,
    remove: removeToast,
    configure,
    getToasts,
    getQueue
  };
}))); 