package com.fungame.utils;

/**
 * 参考BigDecimal, 可重用的StringBuilder, 节约StringBuilder内部的char[]
 * 
 * 参考下面的示例代码将其保存为ThreadLocal.
 * 
 * private static final ThreadLocal<StringBuilderHelper> threadLocalStringBuilderHolder = new ThreadLocal<StringBuilderHelper>() {
 * 	&#64;Override
 * 	protected StringBuilderHelper initialValue() {
 * 		return new StringBuilderHelper(256);
 * 	}
 * };
 * 
 * StringBuilder sb = threadLocalStringBuilderHolder.get().resetAndGetStringBuilder();
 *
 */
public class StringBuilderHolder {

	private final StringBuilder sb;

	public StringBuilderHolder(int capacity) {
		sb = new StringBuilder(capacity);
	}

	/**
	 * 重置StringBuilder内部的writerIndex, 而char[]保留不动.
	 */
	public StringBuilder resetAndGetStringBuilder() {
		sb.setLength(0);
		return sb;
	}
	
	public static void main(String args[]) {

		ThreadLocal<StringBuilderHolder> stringBuilder = new ThreadLocal<StringBuilderHolder>() {
			protected StringBuilderHolder initialValue() {
		        return new StringBuilderHolder(256);
		    }
		};
		
		StringBuilder sb = stringBuilder.get().resetAndGetStringBuilder();
		sb.append("ab").append("_").append("cd");
		System.out.println(sb.toString());
	}
}