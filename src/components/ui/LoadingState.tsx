import Spinner from './Spinner';

export default function LoadingState() {
    return (
        <div className="flex w-full h-full min-h-[50vh] items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-100/50 shadow-sm">
                <Spinner className="scale-110" />
                <p className="text-sm font-medium text-slate-500 animate-pulse tracking-wide">Chargement...</p>
            </div>
        </div>
    );
}
