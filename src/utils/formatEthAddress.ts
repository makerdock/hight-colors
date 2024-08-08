/**
 * Formats an Ethereum address by shortening it.
 * @param address The full Ethereum address to format.
 * @param startLength The number of characters to show at the start of the address. Default is 6.
 * @param endLength The number of characters to show at the end of the address. Default is 4.
 * @returns The formatted address string.
 */
export function formatEthAddress(address: string, startLength: number = 6, endLength: number = 4): string {
    if (!address) return '';

    // Ensure the address is valid (basic check)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error('Invalid Ethereum address');
    }

    // If the address is shorter than the combined start and end lengths, return it as is
    if (address.length <= startLength + endLength) {
        return address;
    }

    const start = address.slice(0, startLength + 2); // +2 to include "0x"
    const end = address.slice(-endLength);

    return `${start}...${end}`;
}