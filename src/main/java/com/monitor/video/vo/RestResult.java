package com.monitor.video.vo;


/**
 * REST返回结果.
 */
public class RestResult<T> {
    /**
     * 状态码,长度固定为6位的字符串.
     */
    private String status;
    /**
     * 状态信息,错误描述.
     */
    private String message;
    /**
     * 数据.
     */
    private T content;

    private RestResult(String status, String message, T content) {
        this.status = status;
        this.message = message;
        this.content = content;
    }

    private RestResult(String status, String message) {
        this.status = status;
        this.message = message;
    }

    private RestResult(String message) {
        this.message = message;
    }

    /**
     * 创建一个带有<b>成功状态</b>的结果对象.
     */
    public static <T> RestResult<T> buildResult(Status status, T content) {
        return new RestResult<T>(status.getCode(), status.getReason(), content);
    }

    /**
     * 创建一个带有<b>成功状态</b>的结果对象.
     */
    protected static <T> RestResult<T> buildResult(Status status) {
        return new RestResult<T>(status.getCode(), status.getReason());
    }

    /**
     * 创建一个带有<b>成功状态</b>的结果对象.
     *
     */
    public static <T> RestResult<T> buildSuccessResult() {
        return buildResult(Status.OK);
    }

    /**
     * 创建一个带有<b>成功状态</b>的结果对象.
     *
     * @param content 业务层处理结果
     */
    public static <T> RestResult<T> buildSuccessResult(T content) {
        return buildResult(Status.OK, content);
    }

    public static <T> RestResult<T> buildErrorResult() {
        return buildResult(Status.ERROR);
    }

    /**
     * 成功后不含有message:OK
     *
     * @param <T>
     * @param content
     * @return
     */
    public static <T> RestResult<T> buildSuccessOkResult(String content) {
        return new RestResult<T>(Status.OK.getCode(), content);
    }

    /**
     * 创建一个带有<b>错误状态</b>的结果对象.
     *
     * @param status 错误状态
     */
    public static <T> RestResult<T> buildErrorResult(Status status) {
        return buildResult(status);
    }

    /**
     * 创建一个带有<b>错误状态</b>的结果对象.
     *
     * @param status  错误状态
     * @param message 错误信息
     */
    public static <T> RestResult<T> buildErrorResult(Status status, String message) {
        return new RestResult<T>(status.getCode(), message);
    }

    public static <T> RestResult<T> buildErrorResult(String message) {
        return new RestResult<T>(message);
    }
    // -- getters --//

    public String getMessage() {
        return message;
    }

    public T getContent() {
        return content;
    }

    public String getStatus() {
        return status;
    }

    public enum Status {
        /**
         * 成功状态,创建成功结果的时候自动设置.
         */
        OK_OLD("200", "OK"),
        OK("000000", "OK"),
        /**
         * 错误状态
         */
        ERROR("000100", "ERROR"),
        /**
         * 错误的请求,参数不正确,如果没有更精确的状态表示,使用此状态.
         */
        BAD_REQUEST("000400", "Bad Request"),

        /**
         * 服务器内部错误,如果没有更精确的状态表示,使用此状态.
         */
        INTERNAL_SERVER_ERROR("000500", "Internal Server Error"),

        UNKOWN_ERROR("000600", "未知错误"),

        NOT_EXIST_ERROR("000700", "数据不存在"),
        AUTH_ERROR("000800", "没有权限"),
        EXIST_ERROR("000900", "数据已经存在");

        /**
         * 状态码,长度固定为6位的字符串.
         */
        private String code;
        /**
         * 错误信息.
         */
        private String reason;

        Status(final String code, final String reason) {
            this.code = code;
            this.reason = reason;
        }

        public String getCode() {
            return code;
        }

        public String getReason() {
            return reason;
        }

        @Override
        public String toString() {
            return code + ": " + reason;
        }

    }
}
