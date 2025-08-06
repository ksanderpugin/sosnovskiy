import './NotificationCenter.scss';

export type NotificationCenterTypes = 'message' |  'error' |  'warning';

export class NotificationCenter {

    private static rootElement: HTMLDivElement | null = null;

    public static showMessage(text: string, timeout = 5000): void {
        NotificationCenter.addItem(text, 'message', timeout);
    }

    public static showError(error: string, timeout = 5000): void {
        NotificationCenter.addItem(error, 'error', timeout);
    }

    public static showWarning(warning: string, timeout = 5000): void {
        NotificationCenter.addItem(warning, 'warning', timeout);
    }

    private static addItem(message: string, type: NotificationCenterTypes = 'message', timeout = 5000): void {
        if (!NotificationCenter.rootElement) {
            NotificationCenter.init();
        }
        const el = document.createElement('div');
        el.className = `nc-message nc-message--${type}`;
        el.style.opacity = '0';
        el.textContent = message;
        NotificationCenter.rootElement?.prepend(el);
        setTimeout( () => {
            el.style.opacity = '1'
        }, 200);
        setTimeout( () => {
            el.style.opacity = '0';
            setTimeout( () => {
                el.remove();
            }, 500);
        }, timeout);
    }

    private static init(): void {
        if (!NotificationCenter.rootElement) {
            NotificationCenter.rootElement = document.createElement('div');
            NotificationCenter.rootElement.className = 'nc-contenier';
            document.body.append(NotificationCenter.rootElement);
        }
    }
}