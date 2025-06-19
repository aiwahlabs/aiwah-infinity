/**
 * Performance tracking utility for analyzing chat message latency
 * 
 * Usage: window.chatPerf.analyze() in the browser console
 */

interface PerformanceEvent {
  timestamp: string;
  event: string;
  data: any;
}

class ChatPerformanceTracker {
  private events: PerformanceEvent[] = [];
  private isTracking = false;
  
  constructor() {
    // Make it available globally in browser
    if (typeof window !== 'undefined') {
      (window as any).chatPerf = this;
    }
  }
  
  startTracking() {
    this.isTracking = true;
    this.events = [];
    console.log('🎯 Chat performance tracking started. Send a message and then run: window.chatPerf.analyze()');
  }
  
  stopTracking() {
    this.isTracking = false;
  }
  
  logEvent(event: string, data: any) {
    if (!this.isTracking) return;
    
    this.events.push({
      timestamp: new Date().toISOString(),
      event,
      data
    });
  }
  
  analyze() {
    if (this.events.length === 0) {
      console.log('❌ No performance events recorded. Make sure to start tracking first with: window.chatPerf.startTracking()');
      return;
    }
    
    // Find key events
    const sendClick = this.events.find(e => e.event === 'send_clicked');
    const apiStart = this.events.find(e => e.event === 'api_call_start');
    const apiEnd = this.events.find(e => e.event === 'api_call_end');
    const userMessageSaved = this.events.find(e => e.event === 'user_message_saved');
    const aiMessageCreated = this.events.find(e => e.event === 'ai_message_created');
    const taskCreated = this.events.find(e => e.event === 'task_created');
    const messageInUI = this.events.find(e => e.event === 'message_in_ui');
    
    console.group('📊 Chat Performance Analysis');
    
    if (sendClick && apiEnd) {
      const totalTime = new Date(apiEnd.timestamp).getTime() - new Date(sendClick.timestamp).getTime();
      console.log(`⏱️ Total time from click to API response: ${totalTime}ms`);
    }
    
    if (sendClick && messageInUI) {
      const uiTime = new Date(messageInUI.timestamp).getTime() - new Date(sendClick.timestamp).getTime();
      console.log(`⏱️ Total time from click to message in UI: ${uiTime}ms`);
    }
    
    // Breakdown
    console.group('📈 Detailed Breakdown:');
    
    const stages = [
      { name: 'UI to API', from: sendClick, to: apiStart },
      { name: 'API parse & auth', from: apiStart, to: userMessageSaved },
      { name: 'Save user message', from: userMessageSaved, to: aiMessageCreated },
      { name: 'Create AI message', from: aiMessageCreated, to: taskCreated },
      { name: 'Create task', from: taskCreated, to: apiEnd },
      { name: 'API to UI update', from: apiEnd, to: messageInUI }
    ];
    
    stages.forEach(stage => {
      if (stage.from && stage.to) {
        const duration = new Date(stage.to.timestamp).getTime() - new Date(stage.from.timestamp).getTime();
        console.log(`${stage.name}: ${duration}ms`);
      }
    });
    
    console.groupEnd();
    
    // Recommendations
    console.group('💡 Optimization Recommendations:');
    
    const recommendations: string[] = [];
    
    stages.forEach(stage => {
      if (stage.from && stage.to) {
        const duration = new Date(stage.to.timestamp).getTime() - new Date(stage.from.timestamp).getTime();
        if (duration > 100 && stage.name.includes('API')) {
          recommendations.push(`Consider optimizing ${stage.name} (currently ${duration}ms)`);
        }
        if (duration > 50 && stage.name.includes('message')) {
          recommendations.push(`Database operation "${stage.name}" is taking ${duration}ms`);
        }
      }
    });
    
    if (recommendations.length === 0) {
      console.log('✅ Performance looks good! All operations are fast.');
    } else {
      recommendations.forEach(rec => console.log(`• ${rec}`));
    }
    
    console.groupEnd();
    console.groupEnd();
    
    // Clear events after analysis
    this.events = [];
  }
  
  clear() {
    this.events = [];
    console.log('🧹 Performance tracking events cleared');
  }
}

// Create singleton instance
export const chatPerformanceTracker = new ChatPerformanceTracker();

// Helper to integrate with existing logs
export function trackPerformanceEvent(event: string, data?: any) {
  if (typeof window !== 'undefined' && (window as any).chatPerf) {
    (window as any).chatPerf.logEvent(event, data);
  }
} 